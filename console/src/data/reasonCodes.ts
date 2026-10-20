export interface ReasonCodeDoc {
  code: string;
  category: "FLOOR" | "VOICE" | "DOCUMENT" | "EMAIL" | "ASK" | "OOB";
  title: string;
  explanationEn: string;
  explanationHi: string;
  action: string;
  severity: "PASS" | "VERIFY" | "HOLD";
}

export const REASON_CODES_CATALOG: ReasonCodeDoc[] = [
  {
    code: "FLOOR_K1_KNOWN_IN_PATTERN",
    category: "FLOOR",
    title: "Known Vendor Within History",
    explanationEn: "Beneficiary and bank details match the vendor master, and amount is inside usual pattern.",
    explanationHi: "लाभार्थी और बैंक विवरण वेंडर मास्टर से मेल खाते हैं और राशि सामान्य रेंज में है।",
    action: "Continue with standard payment workflow.",
    severity: "PASS"
  },
  {
    code: "FLOOR_K2_OUT_OF_PATTERN",
    category: "FLOOR",
    title: "Out-of-Pattern Amount or Dormant Vendor",
    explanationEn: "Beneficiary is in vendor master, but amount is unusually high or last payment was >180 days ago.",
    explanationHi: "लाभार्थी वेंडर मास्टर में है, लेकिन राशि असामान्य है या 180 दिनों से भुगतान नहीं हुआ।",
    action: "Call vendor back on file number before processing payment.",
    severity: "VERIFY"
  },
  {
    code: "FLOOR_N1_NEW_SMALL",
    category: "FLOOR",
    title: "New Vendor (Small Amount)",
    explanationEn: "Beneficiary is new and under the small-payment threshold limit.",
    explanationHi: "नया लाभार्थी है और राशि छोटे भुगतान की सीमा के भीतर है।",
    action: "Normal payment flow; bank new-payee verification still applies.",
    severity: "PASS"
  },
  {
    code: "FLOOR_N2_NEW_LARGE",
    category: "FLOOR",
    title: "New Vendor (Large Amount)",
    explanationEn: "New beneficiary with payment exceeding the small-payment threshold.",
    explanationHi: "नया लाभार्थी है और राशि छोटे भुगतान सीमा से ऊपर है।",
    action: "Mandatory confirmation via OOB-Confirm or official phone callback.",
    severity: "VERIFY"
  },
  {
    code: "FLOOR_C1_BANK_CHANGED",
    category: "FLOOR",
    title: "Vendor Bank Account Changed",
    explanationEn: "Bank account entered does not match existing vendor master records.",
    explanationHi: "बैंक खाता वेंडर मास्टर में दर्ज रिकॉर्ड से अलग है।",
    action: "Mandatory callback to trusted registered vendor phone number.",
    severity: "HOLD"
  },
  {
    code: "EMAIL_LOOKALIKE_DOMAIN",
    category: "EMAIL",
    title: "Look-Alike / Spoofed Domain",
    explanationEn: "Email sender domain uses visual confusables or typosquatting (e.g., rn vs m).",
    explanationHi: "ईमेल डोमेन दिखने में असली जैसा है पर उसमें स्पेलिंग की धोखाधड़ी है।",
    action: "Do not trust attachments or bank details in the email.",
    severity: "HOLD"
  },
  {
    code: "EMAIL_AUTH_FAILED",
    category: "EMAIL",
    title: "SPF / DKIM / DMARC Failed",
    explanationEn: "Authentication headers failed or sender domain is unverified.",
    explanationHi: "ईमेल प्रमाणीकरण (SPF/DKIM/DMARC) विफल रहा।",
    action: "Verify authenticity of communication through secondary channel.",
    severity: "VERIFY"
  },
  {
    code: "DOC_BANK_MISMATCH",
    category: "DOCUMENT",
    title: "Invoice Bank Differs from Master",
    explanationEn: "Bank account printed on invoice PDF contradicts registered records.",
    explanationHi: "चालान (Invoice) पर लिखा बैंक खाता मास्टर रिकॉर्ड से भिन्न है।",
    action: "Place case on hold until direct verbal verification.",
    severity: "HOLD"
  },
  {
    code: "DOC_NEW_CREATOR_TOOL",
    category: "DOCUMENT",
    title: "Suspicious Document Tooling",
    explanationEn: "PDF was created or edited using an unexpected editing application (e.g. Canva, online editors).",
    explanationHi: "पीडीएफ किसी ऑनलाइन एडिटिंग टूल या असामान्य सॉफ्टवेयर से बनाया गया है।",
    action: "Inspect invoice authenticity and verify billing line items.",
    severity: "VERIFY"
  },
  {
    code: "VOICE_SYNTHETIC_HIGH",
    category: "VOICE",
    title: "Synthetic / Deepfake Voice Detected",
    explanationEn: "Multiple audio windows flagged synthetic voice characteristics with high confidence.",
    explanationHi: "ऑडियो में हाई कॉन्फिडेंस के साथ एआई-जनरेटेड या डीपफेक आवाज़ के लक्षण पाए गए।",
    action: "Terminate call immediately. Execute independent out-of-band verification.",
    severity: "HOLD"
  },
  {
    code: "VOICE_AMBIGUOUS_RETEST",
    category: "VOICE",
    title: "Voice Quality Low or Ambiguous",
    explanationEn: "Audio duration or SNR is insufficient for conclusive synthetic determination.",
    explanationHi: "ऑडियो क्वालिटी कम है या स्पष्ट निष्कर्ष निकालने के लिए अपर्याप्त है।",
    action: "Request higher quality recording or initiate direct phone call.",
    severity: "VERIFY"
  },
  {
    code: "ASK_A1_NEW_ACCOUNT",
    category: "ASK",
    title: "Ask: Divert to New Account",
    explanationEn: "Urgent request to transfer funds to a new or alternate bank account.",
    explanationHi: "पैसे किसी नए या अलग बैंक खाते में भेजने का आग्रह।",
    action: "Confirm account change procedure independently.",
    severity: "HOLD"
  },
  {
    code: "ASK_A2_OTP_CREDENTIALS",
    category: "ASK",
    title: "Ask: Share OTP / Secret PIN",
    explanationEn: "Caller or message requests one-time password or security credentials.",
    explanationHi: "ओटीपी, पासवर्ड या पिन साझा करने की मांग।",
    action: "Never share OTP under any circumstances.",
    severity: "HOLD"
  },
  {
    code: "ASK_A3_REMOTE_ACCESS",
    category: "ASK",
    title: "Ask: Install Remote Access Tool",
    explanationEn: "Request to download AnyDesk, TeamViewer, or similar software.",
    explanationHi: "AnyDesk या रिमोट स्क्रीन शेयरिंग टूल डाउनलोड करने का अनुरोध।",
    action: "Do not install remote software; report to IT security.",
    severity: "HOLD"
  },
  {
    code: "ASK_A4_KEEP_SECRET",
    category: "ASK",
    title: "Ask: Keep Confidential / Secret",
    explanationEn: "Requester asks to bypass regular staff or maintain confidentiality.",
    explanationHi: "बात गुप्त रखने या किसी अन्य सहकर्मी को न बताने का दबाव।",
    action: "Inform financial controller and team lead immediately.",
    severity: "VERIFY"
  },
  {
    code: "ASK_A5_BYPASS_PROCESS",
    category: "ASK",
    title: "Ask: Bypass Approval Process",
    explanationEn: "Urgent plea to skip typical internal approvals due to emergency.",
    explanationHi: "आपातकाल का बहाना बनाकर सामान्य अनुमोदन प्रक्रिया को छोड़ने का आग्रह।",
    action: "Adhere strictly to standard four-eye verification policy.",
    severity: "VERIFY"
  }
];

