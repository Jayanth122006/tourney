import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CreditCard, ShieldCheck } from 'lucide-react';
import useScrollReveal from '../utils/useScrollReveal';
import '../styles/forms.css';

const Payment = () => {
  useScrollReveal();
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;

  if (!formData) {
    return <Navigate to="/register" replace />;
  }

  const handlePayment = async () => {
    try {
      // 1. Create Order on Backend
      const orderRes = await fetch("https://tourneyb-production.up.railway.app/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) {
         throw new Error(orderData.message || "Registration failed or unavailable.");
      }

      const sessionId = orderData.payment_session_id;
      const orderId = orderData.order_id;

      if (!sessionId) {
        throw new Error("Failed to get payment session id");
      }

      // 2. Open Cashfree Checkout
      const { load } = await import('@cashfreepayments/cashfree-js');
      const cashfree = await load({ mode: "production" });
      
      cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      }).then(async (result) => {
        if (result.error) {
           alert(result.error.message || "Payment cancelled or failed.");
        }
        if (result.paymentDetails) {
            // 3. Verify & Register Atomically
            try {
                const verifyRes = await fetch("https://tourneyb-production.up.railway.app/api/payment/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId: orderId,
                    formData
                  })
                });

                if (verifyRes.ok) {
                  const resultApi = await verifyRes.json();
                  if (resultApi.pendingMessage) {
                      alert(resultApi.pendingMessage);
                      navigate('/success', { state: { squadData: formData } });
                  } else {
                      // 4. Navigate to Success on Verification
                      navigate('/success', { state: { squadData: resultApi } });
                  }
                } else {
                  const errorResult = await verifyRes.json().catch(() => ({}));
                  alert(errorResult.message || "Payment verification failed!");
                }
            } catch (err) {
                console.error("Verification error:", err);
                alert("An error occurred during verification.");
            }
        }
      });

    } catch (err) {
      console.error("Payment flow failed:", err);
      alert(err.message || "Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div className="app-wrapper animate-fade-in" style={{ padding: '80px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '15px' }}>Registration Fee</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Complete your transaction to secure your tournament slot.</p>
        </div>

        <div className="glass-panel" style={{ padding: '50px', borderRadius: '32px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={20} color="var(--success)" /> Summary
            </h3>

            <div style={{ display: 'grid', gap: '15px', background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase' }}>Squad Name</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>{formData.squadName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase' }}>Squad Leader</span>
                <span style={{ color: 'var(--text-muted)' }}>{formData.leaderName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase' }}>Contact Number</span>
                <span style={{ color: 'var(--text-muted)' }}>{formData.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', opacity: 0.6 }}>ENTRY FEE</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>₹1</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '25px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '800', opacity: 0.5 }}>
              Secure Payment Gateway: <span style={{ color: 'var(--success)' }}>Active</span>
            </p>
            <button onClick={handlePayment} className="btn btn-primary" style={{ width: '100%', height: '65px', borderRadius: '18px', fontSize: '1.1rem' }}>
              <CreditCard size={20} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
              COMPLETE TRANSACTION
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '20px', lineHeight: '1.6', opacity: 0.5 }}>
              By clicking complete, you agree to the non-refundable registration policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;