const { FetchError } = require("@inrupt/solid-client");
const { fetchUserInformations } = require("../utils/fetchUserInformations");

test("FETCH_USER_OK : fetch user informations when everything is ok", async () => {
  expect(
    await fetchUserInformations("https://pod.inrupt.com/atalby1/")
  ).toStrictEqual({
    firstName: "Achraf",
    lastName: "Talby",
    email: "achraf.talby@insa-rouen.fr",
  });
});

test("FETCH_USER_NO_FILE : fetch user informations when no matching file", async () => {
  expect(
    (await fetchUserInformations(
      "https://pod.inrupt.com/mvanaudenhove/"
    )) instanceof FetchError
  ).toBeTruthy();
});

test("FETCH_USER_NO_EMAIL : fetch user informations when email missing", async () => {
  expect(
    await fetchUserInformations("https://pod.inrupt.com/testpodpotions/")
  ).toEqual({ email: null, firstName: "Achraf", lastName: "Talby" });
});

test("FETCH_USER_WRONG_POD_URL : fetch user informations when invalid pod url", async () => {
  error = await fetchUserInformations("https://invalid/pod/url/");
  errorMessage = error.message;
  expect(errorMessage).toEqual(
    "request to https://invalid/pod/url/public/userInformations failed, reason: getaddrinfo ENOTFOUND invalid"
  );
});

test("FETCH_USER_WRONG_URL : fetch user informations when invalid url", async () => {
  expect(
    (await fetchUserInformations("invalid/url")) instanceof TypeError
  ).toBeTruthy();
});
