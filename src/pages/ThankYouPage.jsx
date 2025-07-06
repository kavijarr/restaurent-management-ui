import React, { useEffect } from "react";

const ThankYouPage = () => {
  useEffect(() => {

    window.history.pushState(null, "", window.location.href);


    window.onpopstate = () => {
      window.history.go(1);
    };
  }, []);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh", textAlign: "center", padding: "20px" }}
    >
      <h1>Thank You!</h1>
      <p>Your order has been successfully completed. We appreciate your business!</p>
    </div>
  );
};

export default ThankYouPage;
