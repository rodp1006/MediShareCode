import { useState } from 'react';
const xrpl = require("xrpl");

function App() {
  const [patientName, setPatientName] = useState('');
  const [DoB, setDoB] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [practName, setPractName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [reasonVisit, setReasonVisit] = useState('');
  const [areaVisit, setAreaVisit] = useState('');
  const [diagnostic, setDiagnostic] = useState('');
  const [diagnosticURL, setDiagnosticURL] = useState('');
  const [xrplAddress, setXrplAddress] = useState('');
  const [xrplSecret, setXrplSecret] = useState('');
  const [tokenID, setTokenID] = useState('');

  async function mintToken() {

    const wallet = xrpl.Wallet.fromSeed(xrplSecret)
    const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
    await client.connect()
    console.log("Connected to devnet")

    const Information = 'Patient\'s Name: ' + patientName + ' Date of Birth: ' + DoB + '/ Full Address: ' + fullAddress + ' Phone Number: ' + phoneNumber +
    '/Name of Practitioner: ' + practName + ' Name of Clinic: ' + clinicName + '/Reason for Visit: ' + reasonVisit + ' Area of Visit: ' + areaVisit +
    '/Diagnostic : ' + diagnostic

    console.log(Information)

    const transactionBlob = {
      TransactionType: "NFTokenMint",
      Account: wallet.classicAddress,
      URI: xrpl.convertStringToHex(diagnosticURL),
      Flags: 8,
      Memos: [
          {
            Memo: {
              MemoType: Buffer.from('Information', 'utf8').toString('hex').toUpperCase(),
              MemoData: Buffer.from(Information, 'utf8').toString('hex').toUpperCase()
            }
          }
        ],
      NFTokenTaxon: 0
    }

    const tx = await client.submitAndWait(transactionBlob,{wallet});

    const nfts = await client.request({
      method: "account_nfts",
      xrplAddress: wallet.classicAddress  
  })
  console.log(nfts)

  alert(nfts.result.account_nfts)
  
  client.disconnect()
  }


  return (
      <div className="App">
           <div className="content">
                <h1>MediShare</h1>
                <img src={require('./HealthLogo.png')} alt="MediShare" style={{ height: "90px" }} />
                <h3>Medical diagnostics on the XRPL Ledger</h3>
           </div>

           <div className="create">
                <h2>Add a New Medical Record</h2>
                <form>
                     <div className="row">
                          <div className="column_70">
                               <label>Patient's Name</label>
                               <input type="text" required value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                          </div>
                          <div className="column_30">
                               <label>Date of Birth</label>
                               <input type="date" required value={DoB} onChange={(e) => setDoB(e.target.value)} />
                          </div>
                     </div>
                     <div className="row">
                          <div className="column_75">
                               <label>Full Address</label>
                               <input type="text" required value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} />
                          </div>
                          <div className="column_25">
                               <label>Phone Number</label>
                               <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                          </div>
                     </div>
                     <div className="row">
                          <div className="column_50">
                               <label>Name of Practitioner</label>
                               <input type="text" required value={practName} onChange={(e) => setPractName(e.target.value)} />
                          </div>
                          <div className="column_45">
                               <label>Name of Clinic</label>
                               <input type="text" required value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
                          </div>
                     </div>
                     <div className="row">
                          <div className="column_70">
                               <label>Reason for Visit</label>
                               <input type="text" required value={reasonVisit} onChange={(e) => setReasonVisit(e.target.value)} />
                          </div>
                          <div className="column_30">
                               <label>Area of Visit</label>
                               <select value={areaVisit} onChange={(e) => setAreaVisit(e.target.value)}>
                                    <option value="all">Allergy</option>
                                    <option value="der">Dermatology</option>
                                    <option value="rad">Radiology</option>
                                    <option value="neu">Neurology</option>
                                    <option value="ped">Pediatrics</option>
                                    <option value="psy">Psychiatry</option>
                                    <option value="uro">Urology</option>
                               </select>
                          </div>
                     </div>
                     <label>Diagnostic (Information pertaining to the patient's visit)</label>
                     <textarea required value={diagnostic} onChange={(e) => setDiagnostic(e.target.value)}></textarea>
                     <label>Diagnostic Image URL (Upload to any image sharing website)</label>
                     <input type="text" required value={diagnosticURL} onChange={(e) => setDiagnosticURL(e.target.value)} />
                     <label>.</label>
                     <div className="row">
                          <div className="column_50">
                               <label><strong>XRPL Address</strong></label>
                               <input type="text" required value={xrplAddress} onChange={(e) => setXrplAddress(e.target.value)} />
                          </div>
                          <div className="column_45">
                               <label><strong>XRPL Secret</strong></label>
                               <input type="text" required value={xrplSecret} onChange={(e) => setXrplSecret(e.target.value)} />
                          </div>
                     </div>
                     <button className="button" role="button" onClick={mintToken}>Add Record</button>
                </form>
           </div>
      </div>
  );
}

export default App;
