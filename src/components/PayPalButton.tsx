import { useEffect, useRef } from "react";

declare global {
  interface Window {
    paypal: any;
  }
}

let paypalScriptAppended = false;

type Customer = {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
};

type Item = { name: string; quantity: number; price: number };

export default function PayPalButton({
  amountCents,
  customer,
  items,
  orderNumber
}: {
  amountCents: number;
  customer?: Customer;
  items?: Item[];
  orderNumber?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderedRef = useRef(false);
  useEffect(() => {
    const amount = (Math.round(amountCents) / 100).toFixed(2);
    const renderButtons = () => {
      const container = containerRef.current;
      if (!container || !window.paypal || renderedRef.current) return;
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
              application_context: {
                shipping_preference: "NO_SHIPPING",
                brand_name: "Kalėdų Kampelis"
              },
              purchase_units: [
                {
                  description: orderNumber ? `Užsakymas ${orderNumber}` : "Užsakymas",
                  amount: { value: amount, currency_code: "EUR" },
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
              // Client-side notify (fallback) to Discord
              try {
                const base = window.location.origin;
                fetch(`${base}/api/notify-discord`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    provider: "paypal",
                    orderNumber,
                    total: amount,
                    customer: customer || {},
                    items: (items || []).map(it => ({
                      name: it.name,
                      quantity: it.quantity,
                      price: it.price
                    }))
                  })
                }).catch(() => {});
              } catch {}
            });
          },
          onError: function (err: any) {
            console.error("PayPal error:", err);
          },
        })
        .render(container)
        .then(() => { renderedRef.current = true; })
        .catch(() => {});
    };

    if (window.paypal) {
      // render after microtask so React commits the node
      setTimeout(renderButtons, 0);
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
      renderedRef.current = false;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [amountCents, orderNumber]);

  return (
    <div className="mt-4">
      <div ref={containerRef} style={{ width: '100%' }}></div>
    </div>
  );
}


