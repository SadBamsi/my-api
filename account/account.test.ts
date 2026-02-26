import {
  createAccount,
  getAccountsByUser,
  deleteAccount,
} from "../account/account.controller";

// Simple mock for express request/response
const mockRequest = (body: any, params: any = {}) => ({ body, params }) as any;
const mockResponse = () => {
  const res: any = {};
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data: any) => {
    res.body = data;
    return res;
  };
  return res;
};

async function testAccountManagement() {
  console.log("Running Account Management Tests...");

  const userId = 1;
  let accountId: number;

  // 1. Test Create Account
  console.log("\n1. Testing Create Account...");
  const createReq = mockRequest({
    userId,
    accountName: "Management Test Account",
    currency: "USD",
  });
  const createRes = mockResponse();
  await createAccount(createReq, createRes);

  if (createRes.statusCode === 201) {
    accountId = createRes.body.account.id;
    console.log("✅ Create Account Passed. Account ID:", accountId);
  } else {
    console.log(
      "❌ Create Account Failed:",
      createRes.statusCode,
      createRes.body,
    );
    process.exit(1);
  }

  // 2. Test Get Accounts
  console.log("\n2. Testing Get Accounts By User...");
  const getReq = mockRequest({}, { userId: userId.toString() });
  const getRes = mockResponse();
  await getAccountsByUser(getReq, getRes);

  if (getRes.statusCode === 200 || !getRes.statusCode) {
    // 200 is default for res.json in mock
    console.log("✅ Get Accounts Passed. Count:", getRes.body.length);
  } else {
    console.log("❌ Get Accounts Failed:", getRes.statusCode, getRes.body);
    process.exit(1);
  }

  // 3. Test Delete Account
  console.log("\n3. Testing Delete Account...");
  const deleteReq = mockRequest({}, { accountId: accountId.toString() });
  const deleteRes = mockResponse();
  await deleteAccount(deleteReq, deleteRes);

  if (deleteRes.statusCode === 200 || !deleteRes.statusCode) {
    console.log("✅ Delete Account Passed");
  } else {
    console.log(
      "❌ Delete Account Failed:",
      deleteRes.statusCode,
      deleteRes.body,
    );
    process.exit(1);
  }

  console.log("\n🎉 ALL MANAGEMENT TESTS PASSED");
}

testAccountManagement();
