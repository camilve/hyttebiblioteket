import React from "react";
import { IonModal, IonText } from "@ionic/react";
import "./TermsModal.css";

interface TermsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TermsModal: React.FC<TermsProps> = ({ open, setOpen }) => {
  return (
    <IonModal
      isOpen={open}
      //swipeToClose={true}
      onDidDismiss={() => setOpen(false)}
      breakpoints={[0, 0.6]}
      initialBreakpoint={0.6}
    >
      <div id="feedbackContent">
        <IonText id="textColor">
          <p style={{ fontSize: "1rem" }}>1. Ansvarsbegrensning</p>
          Hyttebiblioteket kan ikke holdes ansvarlig for eventuelle tap eller
          skader av bøker.
          <br />
          <p style={{ fontSize: "1rem" }}>2. Oppførsel</p>
          Vi oppfordrer alle til å bruke en hyggelig tone, samt respektere
          andres bøker og registrere hvis du henter bøker slik at systemet er
          oppdatert over hva som ligger ute.
          <br />
          <p style={{ fontSize: "1rem" }}>Kontaktdetaljer</p>
          Send henvendelser til email: <i>kontakt.hyttebiblioteket@gmail.com</i>
          <br />
        </IonText>
      </div>
    </IonModal>
  );
};

export default TermsModal;
