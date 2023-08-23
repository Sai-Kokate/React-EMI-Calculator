import { useEffect, useState } from "react";
import { tenureData } from "./utils/constants";
import { numberWithCommas } from "./utils/commaSeparatedNumbers";

function App() {
  const [principal, setPrincipal] = useState("");
  const [interest, setInterest] = useState(10);
  const [processingFees, setProcessingFees] = useState(1);
  const [downpayment, setDownpayment] = useState(0);
  const [emi, setEmi] = useState(0);
  const [tenure, setTenure] = useState(12);

  const calculateEMI = (dp) => {
    // EMI amount = [P x R x (1+R)^N]/[(1+R)^N-1]
    if (!principal) return;

    const loanAmt = principal - dp;
    const rateOfInterest = interest / 100;
    const numOfYears = tenure / 12;

    const EMI =
      (loanAmt * rateOfInterest * (1 + rateOfInterest) ** numOfYears) /
      ((1 + rateOfInterest) ** numOfYears - 1);

    return Number(EMI / 12).toFixed(0);
  };

  const calculateDP = (emi) => {
    if (!principal) return;

    const downPaymentPercent = 100 - (emi / calculateEMI(0)) * 100;
    return Number((downPaymentPercent / 100) * principal).toFixed(0);
  };

  useEffect(() => {
    if (!(principal > 0)) {
      setDownpayment(0);
      setEmi(0);
    }

    const emi = calculateEMI(downpayment);
    setEmi(emi);
  }, [tenure, principal]);

  const updateEMI = (e) => {
    if (!principal) return;

    const dp = Number(e.target.value);
    setDownpayment(dp.toFixed(0));

    const emi = calculateEMI(dp);
    setEmi(emi);
  };

  const updateDownpayment = (e) => {
    if (!principal) return;

    const emi = Number(e.target.value);
    setEmi(emi.toFixed(0));

    const dp = calculateDP(emi);
    setDownpayment(dp);
  };

  const totalDownPayment = () => {
    return numberWithCommas(
      (
        Number(downpayment) +
        (principal - downpayment) * (processingFees / 100)
      ).toFixed(0)
    );
  };

  const totalEMI = () => {
    return numberWithCommas((emi * tenure).toFixed(0));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col w-1/2 h-11/12 justify-start items-start font-semibold">
        <h1 className=" text-xl font-bold">EMI Calculator</h1>
        {/* Principal Amount */}
        <div className="flex flex-col gap-2 w-full mt-2">
          <label className="text-lg">Total cost of Asset</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            placeholder="Enter Your Amount!"
            className="border w-full"
          />
        </div>

        {/* Interest Rate */}
        <div className="flex flex-col gap-2 w-full mt-2">
          <label>Interst Rate (in %)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={interest}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              const clampedValue = Math.min(100, Math.max(0, newValue));
              setInterest(clampedValue);
            }}
            placeholder="Enter Your Amount!"
            className="border w-full"
          />
        </div>

        {/* Processing Fees */}
        <div className="flex flex-col gap-2 w-full mt-2">
          <label>Processing Fee (in %)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={processingFees}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              const clampedValue = Math.min(100, Math.max(0, newValue));
              setProcessingFees(clampedValue);
            }}
            placeholder="Enter Your Amount!"
            className="border w-full"
          />
        </div>

        {/* DownPayment */}
        <div className="flex flex-col gap-2 w-full mt-2">
          <label>Downpayment</label>
          <div>{`Total downpayment - ${totalDownPayment()}`}</div>
          <input
            type="range"
            min={0}
            max={principal}
            value={downpayment}
            onChange={(e) => updateEMI(e)}
          />
          <div className="flex justify-between w-full">
            <label>0%</label>
            <b>{downpayment}</b>
            <label>100%</label>
          </div>
        </div>

        {/* EMI */}
        <div className="flex flex-col gap-2 w-full mt-2">
          <label>Loan Per Month</label>
          <div>{`Total Loan Amount - ${totalEMI()}`}</div>
          <input
            type="range"
            min={calculateEMI(principal)}
            max={calculateEMI(0)}
            value={emi}
            onChange={(e) => updateDownpayment(e)}
          />
          <div className="flex justify-between w-full">
            <label>{calculateEMI(principal)}</label>
            <b>{emi}</b>
            <label>{calculateEMI(0)}</label>
          </div>
        </div>

        {/* Tenure */}
        <div className="flex justify-between w-full mt-4">
          {tenureData.map((t) => {
            return (
              <button
                key={t}
                onClick={() => setTenure(t)}
                className={`px-4 py-2 ${
                  tenure === t ? "bg-blue-500" : "bg-gray-300"
                } rounded-md`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
