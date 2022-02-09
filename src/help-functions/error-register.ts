export function getErrorMessage(errorCode: string) {
  if (errorCode === "auth/email-already-in-use") {
    return "Det finnes allerede en konto tilknyttet denne eposten";
  }
  if (errorCode === "auth/invalid-email") {
    return "Eposten er ugyldig";
  }
  return "Noe gikk galt under registreringen, prøv på nytt senere.";
}
