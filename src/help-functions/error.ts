export function getErrorMessage(errorCode: string) {
  if (errorCode === "auth/email-already-in-use") {
    return "Det finnes allerede en konto tilknyttet denne eposten";
  }
  if (errorCode === "auth/invalid-email") {
    return "Eposten er ugyldig";
  }
  return "Noe gikk galt under registreringen, prøv på nytt senere.";
}

export function getLocationErrorMessage(errorCode: number) {
  if (errorCode === 1) {
    return "Bruker har slått av posisjonsdeling";
  }
  if (errorCode === 2) {
    return "Finner ikke posisjon";
  }
  if (errorCode === 3) {
    return "Posisjonshenting timet ut";
  }
  return "Kan ikke hente posisjon";
}
