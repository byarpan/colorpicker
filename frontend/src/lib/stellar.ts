import {
  Contract,
  rpc,
  Address,
  xdr,
  scValToNative,
  nativeToScVal,
  TransactionBuilder,
  Networks,
  Keypair,
  Account
} from "@stellar/stellar-sdk";
import {
  isConnected,
  getAddress,
  signTransaction,
  requestAccess
} from "@stellar/freighter-api";
import { CONTRACT_ID, NETWORK_PASSPHRASE, RPC_URL } from "./constants";

const server = new rpc.Server(RPC_URL);

/**
 * Checks if Freighter is installed and attempts to wake it up.
 */
export async function checkWalletConnection() {
  try {
    const result = await isConnected();
    if (result.isConnected) return true;

    // Fallback: Sometimes isConnected is false if just installed or locked, 
    // but a direct getAddress might trigger it.
    const address = await getWalletAddress();
    return !!address;
  } catch (e) {
    return false;
  }
}

/**
 * Robustly connects to Freighter by attempting multiple access patterns.
 */
export async function connectFreighter(): Promise<{ address?: string; error?: string }> {
  try {
    // 1. Try to get address silently first
    const silentResult = await getAddress();
    if (silentResult && silentResult.address) {
      return { address: silentResult.address };
    }

    // 2. Explicit request - this triggers the "Share Address" popup
    const authorizedAddress = await requestAccess();
    if (authorizedAddress && typeof authorizedAddress === "string") {
      return { address: authorizedAddress };
    }

    // Handle case where authorizedAddress might be an object in some environments
    if (authorizedAddress && (authorizedAddress as any).address) {
      return { address: (authorizedAddress as any).address };
    }

    return { error: "No account found or authorization declined." };
  } catch (error: any) {
    console.error("Freighter connection error:", error);
    return { error: error.message || "Unknown connection error" };
  }
}

/**
 * Gets the address of the connected wallet.
 */
export async function getWalletAddress() {
  try {
    const result = await getAddress();
    return result.address || null;
  } catch (error) {
    return null;
  }
}

/**
 * Retrieves the stored color for a user.
 */
export async function getUserColor(userAddress: string) {
  try {
    const contract = new Contract(CONTRACT_ID);
    const userVal = nativeToScVal(Address.fromString(userAddress));

    const result = await server.getContractData(
      contract.address(),
      nativeToScVal("COLORS", { type: "symbol" }),
      rpc.Durability.Persistent
    );

    if (result && result.val) {
      const colorsMap = scValToNative(result.val as any);
      // The contract logic stores a map of Address to String
      // If result.val is the map, we need to find the user's color.
      // map is: Map<Address, String>
      const color = colorsMap.get ? colorsMap.get(userAddress) : null;
      return color;
    }

    // Alternative: call get_color function directly via simulateTransaction
    const tx = new TransactionBuilder(
      new Account(Keypair.random().publicKey(), "0"), // Use a dummy Account for simulation
      { fee: "100", networkPassphrase: NETWORK_PASSPHRASE }
    )
      .addOperation(
        contract.call("get_color", userVal)
      )
      .setTimeout(30)
      .build();

    const simulation = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationSuccess(simulation)) {
      const result = simulation.result;
      if (result && result.retval) {
        return scValToNative(result.retval);
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching user color:", error);
    return null;
  }
}

/**
 * Stores a color for the user.
 */
export async function pickColor(userAddress: string, color: string) {
  try {
    const contract = new Contract(CONTRACT_ID);
    const userVal = nativeToScVal(Address.fromString(userAddress));
    const colorVal = nativeToScVal(color);

    // Proper transaction preparation:
    let account;
    try {
      account = await server.getAccount(userAddress);
    } catch (e: any) {
      if (e.status === 404 || (e.response && e.response.status === 404)) {
        throw new Error("ACCOUNT_NOT_FUNDED");
      }
      throw e;
    }

    const tx = new TransactionBuilder(account, {
      fee: "1000",
      networkPassphrase: NETWORK_PASSPHRASE
    })
      .addOperation(contract.call("pick_color", userVal, colorVal))
      .setTimeout(30)
      .build();

    // MANDATORY FOR SOROBAN: Prepare the transaction (Simulates and adds footprints/fees)
    let preparedTx;
    try {
      preparedTx = await server.prepareTransaction(tx);
    } catch (simError: any) {
      console.error("Simulation failed:", simError);
      throw new Error(`SIMULATION_FAILED: ${simError.message || "Unknown simulation error"}`);
    }

    const signedResponse = await signTransaction(preparedTx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
    if (signedResponse.error) {
      throw new Error(`SIGNING_FAILED: ${signedResponse.error}`);
    }
    const signedXdr = signedResponse.signedTxXdr;
    const finalTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);

    // Submit transaction and wait for ledger inclusion
    const sendResponse = await server.sendTransaction(finalTx);

    if (sendResponse.status === "ERROR") {
      throw new Error(`Transaction failed: ${sendResponse.errorResult}`);
    }

    // Wait for the transaction to be confirmed
    let status: any = sendResponse.status;
    let pollCount = 0;
    while (status === "PENDING" && pollCount < 10) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const statusResponse = await server.getTransaction(sendResponse.hash);
      status = statusResponse.status;
      pollCount++;
    }

    return sendResponse;
  } catch (error: any) {
    console.error("Error picking color:", error);
    // Preserving already prefixed errors, prefixing unknown ones
    if (error.message && (
      error.message.startsWith("SIMULATION_FAILED") || 
      error.message.startsWith("SIGNING_FAILED") || 
      error.message === "ACCOUNT_NOT_FUNDED"
    )) {
      throw error;
    }
    throw new Error(`TRANSACTION_ERROR: ${error.message || "Unknown error during transaction"}`);
  }
}
