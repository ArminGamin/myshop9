import { useEffect } from "react";

declare global {
  interface Window {
    paypal: any;
  }
}

let paypalScriptAppended = false;

export default function PayPalButton({ amountCents }: { amountCents: number }) {
  useEffect(() => {
    const amount = (Math.round(amountCents) / 100).toFixed(2);
    const renderButtons = () => {
      const container = document.getElementById("paypal-button-container");
      if (!container || !window.paypal) return;
      container.innerHTML = "";
      window.paypal
        .Buttons({
          fundingSource: window.paypal.FUNDING.PAYPAL,
          style: {
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 45,
          },
          createOrder: function (_data: any, actions: any) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: amount },
                },
              ],
            });
          },
          onApprove: function (_data: any, actions: any) {
            return actions.order.capture().then(function (details: any) {
              alert(
                "Apmokėjimas sėkmingas! Ačiū, " +
                  details.payer.name.given_name
              );
              // TODO: send order info to backend / mark as paid
            });
          },
          onError: function (err: any) {
            console.error("PayPal error:", err);
          },
        })
        .render("#paypal-button-container");
    };

    if (window.paypal) {
      renderButtons();
    } else {
      if (!paypalScriptAppended) {
        const existing = document.getElementById("paypal-sdk");
        if (!existing) {
          const script = document.createElement("script");
          script.id = "paypal-sdk";
          script.src =
            "https://www.paypal.com/sdk/js?client-id=ATGx56eqxqaz4iE4LhwoW_M1t-KszuyGy_dKPIeuT7yzsYbpeQL5xXNXlI7IgNit0KllFbQV6QgJGHnb&currency=EUR&components=buttons&intent=capture&disable-funding=card,credit";
          script.async = true;
          script.onload = renderButtons;
          document.body.appendChild(script);
        }
        paypalScriptAppended = true;
      } else {
        // Script was appended but not yet ready; wait briefly then try
        setTimeout(renderButtons, 300);
      }
    }

    return () => {
      const container = document.getElementById("paypal-button-container");
      if (container) container.innerHTML = "";
    };
  }, [amountCents]);

  return (
    <div className="mt-4">
      <div id="paypal-button-container" style={{ width: '100%' }}></div>
    </div>
  );
}


