
import { StrKey } from "@stellar/stellar-sdk";

const fragment = "CCCGVNZGATFHOTI3PJIYKAAWUURAN3FJS72K7ADWJI7MLJW7ORI2BOA";
const base32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

console.log("Searching for 56th character for:", fragment);

for (const char of base32) {
  const attempt = fragment + char;
  try {
    if (StrKey.isValidContract(attempt)) {
      console.log("FOUND VALID CONTRACT ID:", attempt);
    }
  } catch (e) {}
}

const fragment2 = "CCIYPN3ORH2VBNGKSVEP5XNRNZF7HFIPPAN5SYK5WEQ7FND6YE46IS7";
console.log("\nSearching for 56th character for:", fragment2);
for (const char of base32) {
  const attempt = fragment2 + char;
  try {
    if (StrKey.isValidContract(attempt)) {
      console.log("FOUND VALID CONTRACT ID:", attempt);
    }
  } catch (e) {}
}
