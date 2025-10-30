import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// ⬇️ Replaced env variable with your publishable key
const stripePromise = loadStripe("pk_live_51SNtWjHs9y4UiPF0epelhyOOkcLOuzVOnUuB0t6RtIxl94X2iETbDDnuL6ciVEc0DJADcG2DUBMwAdwfzSIVMcK900Z2shQyYh");

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const amount = 1798;

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        name: form.name,
        surname: form.surname,
        email: form.email,
        phone: form.phone,
        address: form.address,
        items: "• Kalėdinis Šeimos Pyžamos Komplektas × 1 — €14.99"
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage("Server error: " + (err?.error || res.statusText));
      setLoading(false);
      return;
    }

    const { clientSecret } = await res.json();
    const cardElement = elements.getElement(CardElement);

    const confirm = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { 
        card: cardElement, 
        billing_details: { 
          name: `${form.name} ${form.surname}`, 
          email: form.email 
        }
      }
    });

    if (confirm.error) {
      setMessage(confirm.error.message || "Mokėjimas nepavyko.");
    } else if (confirm.paymentIntent && confirm.paymentIntent.status === "succeeded") {
      setMessage("✅ Apmokėta! Ačiū už užsakymą.");
    } else {
      setMessage("Mokėjimo būsena: " + (confirm.paymentIntent?.status || "unknown"));
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", display: "flex", gap: 24 }}>
      <form onSubmit={handleSubmit} style={{ flex: 1 }}>
        <h2>Apmokėjimas</h2>

        <label>
          Vardas
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Pavardė
          <input name="surname" value={form.surname} onChange={handleChange} />
        </label>

        <label>
          El. paštas
          <input name="email" value={form.email} onChange={handleChange} type="email" required />
        </label>

        <label>
          Telefonas
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>

        <label>
          Adresas
          <input name="address" value={form.address} onChange={handleChange} />
        </label>

        <h3>Mokėjimo informacija</h3>
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6 }}>
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        <button type="submit" disabled={!stripe || loading} style={{ marginTop: 16 }}>
          {loading ? "Apdorojama..." : "Pateikti užsakymą"}
        </button>

        {message && <p style={{ marginTop: 12 }}>{message}</p>}
      </form>

      <aside style={{ width: 320 }}>
        <h3>Užsakymo Santrauka</h3>
        <div>Kalėdinis Šeimos Pyžamos Komplektas</div>
        <div>Kiekis: 1</div>
        <div>Viso: €17.98</div>
      </aside>
    </div>
  );
}

export default function WrappedCheckout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}


