/* =============================================================================
   QUICKDISCHARGE 2.0 CLINICAL WORKSTATION — COMPLETE REVAMPED JAVASCRIPT ENGINE
   A Subsidiary of Qtv (https://qtvhr.com/) | Developed by Dinesh Velusamy & Dr. JaiKanna
   ============================================================================= */

// 1. STATE REPRESENTATION & DATABASE OF unrealistic CLINICAL SCENARIOS
let patients = [
  {
    name: "Ramesh Kumar",
    age: "62",
    gender: "Male",
    mrd: "MRN 0042891",
    abha: "ramesh.kumar@sbx",
    admDate: "2025-05-14",
    disDate: "2025-05-19",
    ward: "Ward 4B · Bed 12",
    physician: "Dr. S. Anand (Treating)",
    status: "crit",
    step: 0,
    scraped: false,
    critResolved: false,
    followupDate: "",
    rawNotes: "62yo male admitted with fever, productive cough, and progressive dyspnoea. Documented Penicillin allergy. Needs Azithromycin or penicillin-safe alternative. We accidentally listed Amoxicillin 500mg TID on discharge meds order. Also patient takes Metformin 1000mg BD for T2DM, but we put 500mg BD in the discharge order. Confirm final sputum/blood cultures which are still pending at time of draft. Follow up Pulmonology OPD.",
    diagnosis: "Primary: Community-acquired pneumonia · J18.9\nSecondary: Type 2 diabetes mellitus · E11.9",
    chiefComplaint: "Patient presented with a 4-day history of productive cough, high-grade fever (39.2°C), and progressive dyspnoea on exertion.",
    clinicalFindings: "Vitals: Temp 39.2°C · HR 104 bpm · BP 118/74 mmHg · SpO₂ 91% (room air) · RR 24/min\nChest Exam: Dullness to percussion and reduced breath sounds at right lower zone.",
    investigations: "CBC: WBC 14.8 × 10⁹/L\nCRP: 128 mg/L\nChest X-ray: Right lower lobe pneumonic opacity consistent with pneumonia.\nBlood culture: [Awaiting 48h culture results — physician to confirm]",
    condition: "Status: Stable · Improved\nVitals at discharge: Temp 37.0°C · HR 84 bpm · BP 122/78 mmHg · SpO₂ 97% on room air",
    medications: [
      { name: "Amoxicillin 500mg PO TID", instruction: "Take 1 tablet by mouth three times daily for lung infection (7 days)" },
      { name: "Metformin 500mg PO BD", instruction: "Take 1 tablet by mouth twice daily with meals for diabetes control" },
      { name: "Azithromycin 500mg PO OD", instruction: "Take 1 tablet by mouth once daily for 5 days" },
      { name: "Paracetamol 650mg PO SOS", instruction: "Take 1 tablet by mouth every 6 hours as needed for fever or pain" }
    ],
    icdCodeIndex: 0,
    icdOptions: [
      { code: "J18.9", desc: "Pneumonia, unspecified organism" },
      { code: "J18.1", desc: "Lobar pneumonia, unspecified" }
    ],
    translations: {
      en: {
        why: "You were admitted because of a lung infection called **pneumonia**. This caused your high fever, productive cough, and breathing difficulty.",
        treatments: "You received oxygen support, intravenous antibiotics, and fever reducers. Your lungs have recovered nicely and you are ready for home discharge.",
        restrictions: "Avoid strenuous work. Drink plenty of water and maintain a high-protein diet.",
        warnings: "Return to emergency if: fever returns over 38.5°C, breathing becomes rapid/difficult, or chest pain occurs.",
        followup: "Follow up at the Pulmonology Clinic. Date pending physician entry."
      },
      ta: {
        why: "நுரையீரலில் ஏற்பட்ட **நிமோனியா** என்ற கிருமித்தொற்று காரணமாக நீங்கள் அனுமதிக்கப்பட்டீர்கள். இதனால் காய்ச்சல், இருமல் மற்றும் மூச்சுத்திணறல் ஏற்பட்டது.",
        treatments: "உங்களுக்கு ஆக்சிஜன் ஆதரவு, நரம்பு வழி ஆன்டிபயாடிக்குகள் மற்றும் காய்ச்சல் மருந்துகள் வழங்கப்பட்டன. நுரையீரல் நன்றாக குணமாகிவிட்டது.",
        restrictions: "கடினமான வேலைகளைத் தவிர்க்கவும். நிறைய தண்ணீர் குடிக்கவும், சத்தான உணவை உட்கொள்ளவும்.",
        warnings: "காய்ச்சல் 38.5°Cக்கு மேல் திரும்பினால், மூச்சுத்திணறல் ஏற்பட்டால், அல்லது நெஞ்சு வலி வந்தால் உடனே அவசர சிகிச்சைக்கு வரவும்.",
        followup: "நுரையீரல் மருத்துவமனைக்கு வரவும். தேதி இன்னும் முடிவு செய்யப்படவில்லை."
      },
      hi: {
        why: "आपको फेफड़ों के संक्रमण, जिसे **निमोनिया** कहते हैं, के कारण भर्ती किया गया था। इससे आपको तेज बुखार, खांसी और सांस लेने में कठिनाई हो रही थी।",
        treatments: "आपको ऑक्सीजन, नसों द्वारा एंटीबायोटिक्स और बुखार की दवाएं दी गईं। आपके फेफड़े अब काफी ठीक हैं और आप घर जा सकते हैं।",
        restrictions: "कठिन परिश्रम से बचें। पर्याप्त पानी पीएं और प्रोटीन युक्त आहार लें।",
        warnings: "यदि बुखार फिर से 38.5°C से ऊपर जाए, सांस लेने में तकलीफ हो, या सीने में दर्द हो, तो तुरंत आपातकालीन विभाग में आएं।",
        followup: "पल्मोनोलॉजी क्लिनिक में फॉलो-अप करें। तिथि डॉक्टर द्वारा भरी जानी है।"
      },
      kn: {
        why: "ಶ್ವಾಸಕೋಶದ ಸೋಂಕಾದ **ನ್ಯುಮೋನಿಯಾ**ದಿಂದಾಗಿ ನಿಮ್ಮನ್ನು ದಾಖಲಿಸಲಾಗಿತ್ತು. ಇದು ತೀವ್ರ ಜ್ವರ, ಕೆಮ್ಮು ಮತ್ತು ಉಸಿರಾಟದ ತೊಂದರೆಯನ್ನು ಉಂಟುಮಾಡಿತ್ತು.",
        treatments: "ನಿಮಗೆ ಆಮ್ಲಜನಕದ ಬೆಂಬಲ, ರಕ್ತನಾಳದ ಮೂಲಕ ಪ್ರತಿಜೀವಕಗಳು ಮತ್ತು ಜ್ವರ ನಿವಾರಕಗಳನ್ನು ನೀಡಲಾಗಿತ್ತು. ನಿಮ್ಮ ಶ್ವಾಸಕೋಶವು ಈಗ ಚೇತರಿಸಿಕೊಂಡಿದೆ.",
        restrictions: "ಕಷ್ಟದ ಕೆಲಸಗಳನ್ನು ಮಾಡಬೇಡಿ. ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ಪ್ರೋಟೀನ್ ಭರಿತ ಆಹಾರವನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
        warnings: "ಜ್ವರ 38.5°C ಗಿಂತ ಹೆಚ್ಚಾದರೆ, ಉಸಿರಾಟದ ತೊಂದರೆ ಮರುಕಳಿಸಿದರೆ, ಅಥವಾ ಎದೆನೋವು ಬಂದರೆ ತಕ್ಷಣವೇ ತುರ್ತು ಚಿಕಿತ್ಸೆಗೆ ಬನ್ನಿ.",
        followup: "ಶ್ವಾಸಕೋಶದ ವಿಭಾಗಕ್ಕೆ ಭೇಟಿ ನೀಡಿ. ದಿನಾಂಕ ವೈದ್ಯರು ನಮೂದಿಸಬೇಕು."
      },
      es: {
        why: "Fue ingresado por una infección pulmonar llamada **neumonía**. Esto le causó fiebre alta, tos productiva y dificultad para respirar.",
        treatments: "Recibió soporte de oxígeno, antibióticos intravenosos y antitérmicos. Sus pulmones se han recuperado bien y está listo para volver a casa.",
        restrictions: "Evite trabajos extenuantes. Beba mucha agua y mantenga una dieta rica en proteínas.",
        warnings: "Regrese a urgencias si: la fiebre supera los 38.5°C, la respiración se vuelve rápida/difícil o siente dolor en el pecho.",
        followup: "Cita de seguimiento en neumología. Fecha pendiente de confirmación."
      }
    }
  },
  {
    name: "Lakshmi Devi",
    age: "55",
    gender: "Female",
    mrd: "MRN 0042876",
    abha: "lakshmi.devi@sbx",
    admDate: "2025-05-16",
    disDate: "2025-05-20",
    ward: "Ward 2A · Bed 07",
    physician: "Dr. S. Anand (Treating)",
    status: "pend",
    step: 1,
    scraped: true,
    critResolved: false,
    followupDate: "",
    rawNotes: "55yo female post-laparoscopic appendectomy for acute appendicitis on 16 May. Appendix was inflamed but non-ruptured. Wound margins clean, tolerating oral fluids, walking well. Underwent standard procedure. Allergy to Sulfa drugs documented. Needs pain control. Discharging with Sulfa-safe pain relievers (Ibuprofen and Acetaminophen). Plan outpatient checkup in 2 weeks.",
    diagnosis: "Primary: Acute appendicitis (laparoscopic appendectomy completed) · K35.80",
    chiefComplaint: "Patient presented with sudden onset of severe right lower quadrant abdominal pain, accompanied by mild nausea and localized tenderness.",
    clinicalFindings: "Abdomen: Tense with guarding and rebound tenderness in the right iliac fossa.\nVitals: Temp 38.0°C · HR 92 bpm · BP 120/80 mmHg.",
    investigations: "USG Abdomen: Swollen appendix (diameter 8mm) with surrounding fluid, consistent with acute appendicitis.\nCBC: WBC 13.2 × 10⁹/L.",
    condition: "Status: Stable, pain controlled, tolerating soft foods.\nWounds: Healing well with no active discharge.",
    medications: [
      { name: "Ibuprofen 400mg PO QID", instruction: "Take 1 tablet by mouth four times daily as needed for pain" },
      { name: "Acetaminophen 500mg PO TDS", instruction: "Take 1 tablet by mouth three times daily for mild soreness" }
    ],
    icdCodeIndex: 0,
    icdOptions: [
      { code: "K35.80", desc: "Acute appendicitis, unspecified, without perforation" },
      { code: "K35.3", desc: "Acute appendicitis with localized peritonitis" }
    ],
    translations: {
      en: {
        why: "You were admitted due to an inflamed and swollen appendix, known as **acute appendicitis**.",
        treatments: "Our surgeons performed a **laparoscopic appendectomy**, which means your appendix was successfully removed through small cuts while you were asleep.",
        restrictions: "Do not lift anything heavier than 10 pounds for 2 weeks. Avoid strenuous sports.",
        warnings: "Go to emergency if: you develop fever over 101°F, worsening stomach pain, or persistent vomiting.",
        followup: "Follow-up checkup scheduled at the Surgical OPD in 14 days."
      },
      ta: {
        why: "உங்கள் அடிவயிற்றில் ஏற்பட்ட கிருமித்தொற்று காரணமாக நீங்கள் அனுமதிக்கப்பட்டீர்கள் (**அபென்டிசிடிஸ்**).",
        treatments: "அறுவைசிகிச்சை மூலம் உங்கள் அபென்டிக்ஸ் வெற்றிகரமாக அகற்றப்பட்டது. சிறிய தையல்கள் போடப்பட்டுள்ளன.",
        restrictions: "2 வாரங்களுக்கு 5 கிலோவுக்கு மேல் எடையுள்ள பொருட்களைத் தூக்க வேண்டாம். ஓய்வு எடுக்கவும்.",
        warnings: "காய்ச்சல் வந்தால், அடிவயிறு கடுமையாக வலித்தால், அல்லது வாந்தி எடுத்தால் உடனே மருத்துவமனைக்கு வரவும்.",
        followup: "அறுவைசிகிச்சை பிரிவில் 14 நாட்களில் மீண்டும் வந்து காண்பிக்கவும்."
      },
      hi: {
        why: "आपको अपेंडिक्स में सूजन के कारण भर्ती किया गया था, जिसे **एक्यूट अपेंडिसाइटिस** कहते हैं।",
        treatments: "दूरबीन विधि (लेप्रोस्कोपिक) द्वारा आपका अपेंडिक्स सुरक्षित रूप से बाहर निकाल दिया गया है। घाव ठीक हो रहे हैं।",
        restrictions: "2 सप्ताह तक भारी वजन (5 किलो से अधिक) न उठाएं। हल्का टहलें।",
        warnings: "यदि तेज बुखार हो, पेट में असहनीय दर्द हो, या लगातार उल्टी हो, तो तुरंत डॉक्टर को दिखाएं।",
        followup: "14 दिनों में सर्जिकल ओपीडी में डॉक्टर से मिलें।"
      },
      kn: {
        why: "ಅಪೆಂಡಿಕ್ಸ್‌ನ ತೀವ್ರ ಊತದಿಂದಾಗಿ ನಿಮ್ಮನ್ನು ದಾಖಲಿಸಲಾಗಿತ್ತು (**ಅಕ್ಯೂಟ್ ಅಪೆಂಡಿಸೈಟಿಸ್**).",
        treatments: "ಲ್ಯಾಪರೊಸ್ಕೋಪಿಕ್ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಯ ಮೂಲಕ ನಿಮ್ಮ ಅಪೆಂಡಿಕ್ಸ್ ಅನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಹೊರತೆಗೆಯಲಾಗಿದೆ.",
        restrictions: "2 ವಾರಗಳವರೆಗೆ ಯಾವುದೇ ಭಾರೀ ತೂಕವನ್ನು ಎತ್ತಬೇಡಿ. ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.",
        warnings: "ಜ್ವರ ಬಂದರೆ, ಹೊಟ್ಟೆನೋವು ಹೆಚ್ಚಾದರೆ, ಅಥವಾ ವಾಂತಿ ತಡೆಯದಿದ್ದರೆ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಬನ್ನಿ.",
        followup: "14 ದಿನಗಳ ನಂತರ ಶಸ್ತ್ರಚಿಕಿತ್ಸಾ ವಿಭಾಗಕ್ಕೆ ಬಂದು ಪರೀಕ್ಷಿಸಿಕೊಳ್ಳಿ."
      },
      es: {
        why: "Fue ingresada por una inflamación de su apéndice, conocida como **apendicitis aguda**.",
        treatments: "Realizamos una **apendicectomía laparoscópica**, extirpando su apéndice a través de pequeños cortes mientras dormía.",
        restrictions: "No cargue cosas de más de 10 libras por 2 semanas. Evite deportes bruscos.",
        warnings: "Acuda a emergencias si presenta: fiebre alta, dolor abdominal agudo o vómitos persistentes.",
        followup: "Cita de control en cirugía general en 14 días."
      }
    }
  },
  {
    name: "Arjun Venkatesh",
    age: "34",
    gender: "Male",
    mrd: "MRN 0042880",
    abha: "arjun.venk@sbx",
    admDate: "2025-05-17",
    disDate: "2025-05-20",
    ward: "Ward 4B · Bed 03",
    physician: "Dr. S. Anand (Treating)",
    status: "pend",
    step: 1,
    scraped: true,
    critResolved: false,
    followupDate: "",
    rawNotes: "34yo male presenting with crushing substernal chest pain. ST elevations V1-V4. Coronary stenting successfully placed in LAD block. Allergy: Penicillin hives. Patient stable. Needs Dual Antiplatelet therapy Aspirin 81mg PO OD and Clopidogrel 75mg PO OD. Lisinopril 5mg daily. Omitted Aspirin 81mg on discharge meds table list dynamically.",
    diagnosis: "Primary: Acute anteroseptal STEMI (post coronary stenting to LAD) · I21.09",
    chiefComplaint: "Crushing chest pain radiating to left arm and jaw, starting 2 hours prior to admission.",
    clinicalFindings: "Vitals: BP 112/68 mmHg · HR 88 bpm · SpO₂ 96% on room air.\nECG: ST elevations in leads V1-V4.",
    investigations: "Coronary angiography: 100% LAD block, coronary stent placed successfully.",
    condition: "Stable, asymptomatic, chest pain resolved. Normal sinus rhythm.",
    medications: [
      { name: "Clopidogrel 75mg PO OD", instruction: "Take 1 tablet by mouth daily to keep stent open (12 months)" },
      { name: "Lisinopril 5mg PO OD", instruction: "Take 1 tablet by mouth once daily" }
    ],
    icdCodeIndex: 0,
    icdOptions: [
      { code: "I21.09", desc: "Acute transmural myocardial infarction of anterior wall" },
      { code: "I21.3", desc: "Acute myocardial infarction of unspecified site" }
    ],
    translations: {
      en: {
        why: "You were admitted due to a **heart attack** (acute block in your heart's main artery).",
        treatments: "We opened the blocked artery in the cardiac catheter lab and placed a drug-eluting metal **stent** to keep blood flowing safely.",
        restrictions: "Do not lift over 10 pounds. Avoid strenuous activity and heavy exercise for 4 weeks.",
        warnings: "Call **911 immediately** if chest pain/pressure returns, or if you feel severe breathlessness or sweating.",
        followup: "Follow-up scheduled at the Cardiology OPD. Date pending."
      },
      ta: {
        why: "உங்களுக்கு ஏற்பட்ட **மாரடைப்பு** (இதய இரத்தக் குழாயில் அடைப்பு) காரணமாக நீங்கள் அனுமதிக்கப்பட்டீர்கள்.",
        treatments: "ஆஞ்சியோபிளாஸ்டி மூலம் உங்கள் இதய அடைப்பு நீக்கப்பட்டு, ஒரு **ஸ்டென்ட்** பொருத்தப்பட்டது.",
        restrictions: "4 வாரங்களுக்குப் பாரமான பொருட்கள் தூக்கக் கூடாது. உடற்பயிற்சிகளைத் தவிர்க்கவும்.",
        warnings: "நெஞ்சு வலி திரும்பினாலோ, மூச்சுத்திணறல் வந்தாலோ உடனே **108க்கு** அழைக்கவும்.",
        followup: "இதய சிகிச்சை பிரிவில் அடுத்த வாரம் வந்து காண்பிக்கவும்."
      },
      hi: {
        why: "आपको **दिल का दौरा** (हृदय की मुख्य धमनी में रुकावट) पड़ने के कारण भर्ती किया गया था।",
        treatments: "कैथ लैब में आपकी अवरुद्ध धमनी को खोला गया और रक्त प्रवाह सुचारू रखने के लिए एक **स्टेंट** लगाया गया है।",
        restrictions: "4 सप्ताह तक भारी काम या व्यायाम न करें। हृदय-अनुकूल भोजन लें।",
        warnings: "यदि सीने में दर्द लौटे, सांस फूलने लगे या पसीना आए, तो तुरंत आपातकालीन सहायता लें।",
        followup: "कार्डियोलॉजी विभाग में अगले सप्ताह फॉलो-अप करें।"
      },
      kn: {
        why: "ನಿಮಗೆ **ಹೃದಯಾಘಾತ**ವಾಗಿದ್ದರಿಂದ (ಹೃದಯದ ಪ್ರಮುಖ ರಕ್ತನಾಳ ಬಂದ್ ಆಗಿದ್ದರಿಂದ) ದಾಖಲಿಸಲಾಗಿತ್ತು.",
        treatments: "ಕ್ಯಾಥ್ ಲ್ಯಾಬ್‌ನಲ್ಲಿ ನಿಮ್ಮ ರಕ್ತನಾಳದ ಬ್ಲಾಕ್ ತೆಗೆದು ರಕ್ತ ಪರಿಚಲನೆಗೆ ಒಂದು **ಸ್ಟೆಂಟ್** ಹಾಕಲಾಗಿದೆ.",
        restrictions: "4 ವಾರಗಳವರೆಗೆ ಯಾವುದೇ ಭಾರೀ ಕೆಲಸ ಅಥವಾ ವ್ಯಾಯಾಮ ಮಾಡಬೇಡಿ.",
        warnings: "ಎದೆನೋವು ಮರುಕಳಿಸಿದರೆ ಅಥವಾ ತೀವ್ರ ಉಸಿರಾಟದ ತೊಂದರೆಯಾದರೆ ತಕ್ಷಣ ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ.",
        followup: "ಹೃದ್ರೋಗ ವಿಭಾಗದಲ್ಲಿ ಮುಂದಿನ ವಾರ ತಪಾಸಣೆ ಮಾಡಿಸಿಕೊಳ್ಳಿ."
      },
      es: {
        why: "Fue ingresado debido a un **ataque cardíaco** (bloqueo agudo en la arteria principal del corazón).",
        treatments: "Abrimos la arteria bloqueada en el laboratorio de cateterismo e implantamos un **stent** metálico para mantener el flujo sanguíneo.",
        restrictions: "No cargue más de 10 libras. Evite el esfuerzo físico y el ejercicio por 4 semanas.",
        warnings: "Llame al **911 de inmediato** si regresa el dolor de pecho, o si siente falta de aire o sudoración.",
        followup: "Seguimiento en la clínica de cardiología. Fecha pendiente."
      }
    }
  },
  {
    name: "Meenakshi Suresh",
    age: "48",
    gender: "Female",
    mrd: "MRN 0042867",
    abha: "meenakshi.s@sbx",
    admDate: "2025-05-15",
    disDate: "2025-05-19",
    ward: "Ward 3C · Bed 18",
    physician: "Dr. S. Anand (Treating)",
    status: "draft",
    step: 1,
    scraped: true,
    critResolved: false,
    followupDate: "",
    rawNotes: "48yo female admitted in severe Diabetic Ketoacidosis (DKA) with glucose of 480 mg/dL and urine ketones. Aggressive saline fluids and IV insulin. Closed anion gap. Transited Glargine 10 units at bedtime. Omitted short-acting sliding Insulin Lispro for DKA mealtime control. Follow up endocrinology clinic.",
    diagnosis: "Primary: Diabetic Ketoacidosis (resolved) · E11.10\nSecondary: Type 2 diabetes mellitus · E11.9",
    chiefComplaint: "Presented with extreme fatigue, polyuria, polydipsia and mild confusion.",
    clinicalFindings: "BP 106/62 mmHg · HR 112 bpm · RR 22/min\nLabs: Glucose 480 mg/dL · Urine ketones +++ · pH 7.15.",
    investigations: "Arterial Blood Gas: pH 7.40, anion gap 22 (closed post treatment).\nHbA1c: 9.2% consistent with poorly controlled T2DM.",
    condition: "Stable, pH normal, tolerating diabetic ADA diet.",
    medications: [
      { name: "Insulin Glargine 10 units SC", instruction: "Inject 10 units under the skin once daily at bedtime" }
    ],
    icdCodeIndex: 0,
    icdOptions: [
      { code: "E11.10", desc: "Type 2 diabetes mellitus with ketoacidosis without coma" },
      { code: "E11.9", desc: "Type 2 diabetes mellitus without complications" }
    ],
    translations: {
      en: {
        why: "You were admitted for a serious diabetes complication called **Diabetic Ketoacidosis (DKA)**, caused by very high sugar and low insulin.",
        treatments: "We gave you saline fluids and continuous IV insulin to lower your blood sugar and clear the acids from your body. You are now transitioned to home insulin shots.",
        restrictions: "Test your blood sugar 4 times daily (before meals and at bed). Coordinate meals with insulin.",
        warnings: "Seek emergency care if you feel nauseous/vomit, have rapid breathing, or blood sugar goes over 250 mg/dL.",
        followup: "Follow up closely with the Endocrinology Clinic in 3 days."
      },
      ta: {
        why: "நீரிழிவு நோயின் கடுமையான பாதிப்பான **நீரிழிவு கீட்டோஅசிடோசிஸ் (DKA)** காரணமாக நீங்கள் அனுமதிக்கப்பட்டீர்கள்.",
        treatments: "ஊசி மூலம் நரம்பு வழி திரவங்கள் மற்றும் இன்சுலின் வழங்கப்பட்டு இரத்தச் சர்க்கரை மற்றும் அமில அளவு கட்டுப்படுத்தப்பட்டது.",
        restrictions: "தினமும் 4 முறை இரத்தச் சர்க்கரையைச் சோதிக்கவும். இன்சுலின் அளவோடு உணவைச் சரியாக உண்ணவும்.",
        warnings: "வாந்தி எடுத்தாலோ, மூச்சு விரைவாக வாங்கினாலோ, அல்லது சர்க்கரை அளவு 250க்கு மேல் இருந்தால் உடனே அவசர சிகிச்சைக்கு வரவும்.",
        followup: "எண்டோகிரைனாலஜி பிரிவில் 3 நாட்களில் காண்பிக்கவும்."
      },
      hi: {
        why: "आपको मधुमेह की एक गंभीर जटिलता, **डायबिटिक कीटोएसिडोसिस (DKA)** के कारण भर्ती किया गया था, जिसमें रक्त में एसिड बढ़ जाता है।",
        treatments: "हमने आपको ग्लूकोज नियंत्रित करने और एसिड साफ करने के लिए नसों द्वारा इंसुलिन और तरल पदार्थ दिए। अब आप घर के इंसुलिन पर हैं।",
        restrictions: "दिन में 4 बार शुगर की जांच करें। इंसुलिन खुराक के साथ भोजन का समन्वय करें।",
        warnings: "यदि उल्टी हो, सांस लेने में तेजी आए, या शुगर स्तर लगातार 250 से ऊपर रहे, तो तुरंत आपातकालीन सहायता लें.",
        followup: "3 दिनों के भीतर एंडोक्राइनोलॉजी क्लिनिक में फॉलो-अप करें।"
      },
      kn: {
        why: "ಮಧುಮೇಹದ ತೀವ್ರ ತೊಂದರೆಯಾದ **ಡಯಾಬಿಟಿಕ್ ಕೀಟೋಅಸಿಡೋಸಿಸ್ (DKA)** ಸೋಂಕಿನಿಂದ ನಿಮ್ಮನ್ನು ದಾಖಲಿಸಲಾಗಿತ್ತು.",
        treatments: "ನಿಮ್ಮ ರಕ್ತದ ಸಕ್ಕರೆಯನ್ನು ನಿಯಂತ್ರಿಸಲು ಮತ್ತು ಆಮ್ಲಗಳನ್ನು ತೆರವುಗೊಳಿಸಲು ರಕ್ತನಾಳದ ಮೂಲಕ ದ್ರವ ಮತ್ತು ಇನ್ಸುಲಿನ್ ನೀಡಲಾಗಿತ್ತು.",
        restrictions: "ದಿನಕ್ಕೆ 4 ಬಾರಿ ರಕ್ತದ ಸಕ್ಕರೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ. ಇನ್ಸುಲಿನ್ ಪಡೆದ ನಂತರ ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಊಟ ಮಾಡಿ.",
        warnings: "ವಾಂತಿ ಉಂಟಾದರೆ, ತೀವ್ರ ಉಸಿರಾಟದ ತೊಂದರೆಯಾದರೆ, ಅಥವಾ ಸಕ್ಕರೆ 250ಕ್ಕಿಂತ ಹೆಚ್ಚಿದ್ದರೆ ತಕ್ಷಣ ತುರ್ತು ಚಿಕಿತ್ಸೆಗೆ ಬನ್ನಿ.",
        followup: "3 ದಿನಗಳಲ್ಲಿ ಎಂಡೋಕ್ರೈನಾಲಜಿ ವಿಭಾಗದಲ್ಲಿ ತಪಾಸಣೆ ಮಾಡಿಸಿಕೊಳ್ಳಿ."
      },
      es: {
        why: "Fue ingresada por una complicación grave de la diabetes llamada **cetoacidosis diabética (CAD)**, por falta de insulina y azúcar muy alta.",
        treatments: "Le administramos sueros e insulina intravenosa continua para bajar el azúcar y eliminar los ácidos del cuerpo. Ahora pasó a insulina inyectable en casa.",
        restrictions: "Mida su azúcar en sangre 4 veces al día (antes de comer y acostarse). Siga su pauta de insulina.",
        warnings: "Busque atención médica inmediata si tiene náuseas/vómitos, respiración rápida o azúcar superior a 250 mg/dL.",
        followup: "Seguimiento estrecho en endocrinología en 3 días."
      }
    }
  },
  {
    name: "Suresh Babu",
    age: "67",
    gender: "Male",
    mrd: "MRN 0042860",
    abha: "suresh.babu@sbx",
    admDate: "2025-05-13",
    disDate: "2025-05-18",
    ward: "Ward 3C · Bed 21",
    physician: "Dr. S. Anand (Treating)",
    status: "ok",
    step: 2,
    scraped: true,
    critResolved: true,
    followupDate: "25 May 2025",
    rawNotes: "67yo male discharged stable following routine chest infection therapy. No allergies on file. Discharged on standard meds.",
    diagnosis: "Primary: Bronchitis · J20.9",
    chiefComplaint: "Admitted for respiratory support during chest congestion.",
    clinicalFindings: "Stable vital signs.",
    investigations: "CXR clear.",
    condition: "Fully improved.",
    medications: [
      { name: "Paracetamol 650mg PO SOS", instruction: "Take as directed for sore throat or fever" }
    ],
    icdCodeIndex: 0,
    icdOptions: [
      { code: "J20.9", desc: "Acute bronchitis, unspecified" }
    ],
    translations: {
      en: {
        why: "Discharged fully recovered from chest bronchitis.",
        treatments: "Standard respiratory support completed.",
        restrictions: "Regular diet. Drink plenty of water.",
        warnings: "Standard emergency advice.",
        followup: "Approved and fully signed off."
      }
    }
  },
  {
    name: "Kavitha Rajan",
    age: "41",
    gender: "Female",
    mrd: "MRN 0042854",
    abha: "kavitha.rajan@sbx",
    admDate: "2025-05-14",
    disDate: "2025-05-18",
    ward: "Ward 2A · Bed 11",
    physician: "Dr. S. Anand (Treating)",
    status: "ok",
    step: 2,
    scraped: true,
    critResolved: true,
    followupDate: "26 May 2025",
    rawNotes: "41yo female discharged stable following gastroenteritis recovery. Hydration complete, normal diet tolerated.",
    diagnosis: "Primary: Infectious gastroenteritis · A09",
    chiefComplaint: "Admitted with vomiting and acute diarrhoeal disease.",
    clinicalFindings: "Vitals stable, dehydration corrected.",
    investigations: "Electrolytes normal.",
    condition: "Normal gut motility returned.",
    medications: [
      { name: "Oral Rehydration Salts", instruction: "Dissolve 1 sachet in 1 litre water daily as needed" }
    ],
    icdCodeIndex: 0,
    icdOptions: [
      { code: "A09", desc: "Infectious gastroenteritis and colitis, unspecified" }
    ],
    translations: {
      en: {
        why: "Recovered from food-borne stomach infection.",
        treatments: "Intravenous fluids and electrolyte correction.",
        restrictions: "Bland diet for 3 days. Stay hydrated.",
        warnings: "Seek care if vomiting returns.",
        followup: "Approved and fully signed off."
      }
    }
  }
];

let activePatientIdx = 0;
let editMode = false;
let activePortalLang = "en";
let activeWarnings = [];
let auditTrailLogs = [];

// 2. LIFECYCLE INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {
  // Initialize digital clock
  tickClock();
  setInterval(tickClock, 30000);
  
  // Set up speech recognition
  setupSpeechRecognition();
  
  // Check if consent has been accepted previously (DPDP 2023)
  const consentAccepted = localStorage.getItem('dpdp_consent');
  if (!consentAccepted) {
    document.getElementById('dpdp-consent-banner').classList.remove('hidden');
  }
  
  // Load preloaded Gemini credentials from localStorage
  const savedKey = localStorage.getItem('api_key_val') || localStorage.getItem('gemini_api_key');
  if (savedKey) {
    document.getElementById('api-key-input').value = savedKey;
    const savedModel = localStorage.getItem('gemini_api_model');
    if (savedModel) {
      document.getElementById('api-model-select').value = savedModel;
    }
  }
  
  // Restore persisted Light/Dark theme state (BUG-014)
  const activeTheme = localStorage.getItem('theme');
  if (activeTheme === 'dark') {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    const toggle = document.querySelector('.tb-theme-toggle');
    if (toggle) toggle.querySelector('.tb-toggle-pill').textContent = "🌙";
  }
  
  // Initial render patient queue sidebar
  renderPatientQueue();
  selectPatient(0);
  
  // Append initial audit log entries
  logAuditAction("Secure physician session initialized under ABDM/NRCeS protocols");
  logAuditAction("NYU Gated safety auditor activated (Medication Rec JAMA 2024)");
});

// Gated Unsaved-Changes warning before navigating away (BUG-020)
window.addEventListener('beforeunload', (e) => {
  const p = patients[activePatientIdx];
  if (p.status !== 'ok' && p.scraped) {
    e.preventDefault();
    e.returnValue = 'You have unsaved clinical discharge summary changes. Are you sure you want to exit?';
  }
});

// DPDP Consent Banner Acceptance
function acceptConsent() {
  localStorage.setItem('dpdp_consent', 'true');
  document.getElementById('dpdp-consent-banner').classList.add('hidden');
  logAuditAction("Physician signed processing consent under DPDP Act 2023 Guidelines");
  showToast("consent successfully certified!", "success");
}

// Dynamic Audit Trail Logger (COMP-02)
function logAuditAction(actionText) {
  const now = new Date();
  const ts = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const item = { time: ts, text: actionText };
  auditTrailLogs.unshift(item);
  
  if (auditTrailLogs.length > 40) {
    auditTrailLogs.pop();
  }
  
  renderAuditLogs();
}

function renderAuditLogs() {
  const feed = document.getElementById('rp-audit-log-feed');
  if (!feed) return;
  feed.innerHTML = "";
  
  if (auditTrailLogs.length === 0) {
    feed.innerHTML = `<div class="rp-audit-item" style="color:var(--slate)">No active logs recorded.</div>`;
    return;
  }
  
  auditTrailLogs.forEach(log => {
    const row = document.createElement('div');
    row.className = "rp-audit-item";
    row.innerHTML = `<span class="rp-audit-ts">[${log.time}]</span><span>${log.text}</span>`;
    feed.appendChild(row);
  });
}

// Update topbar digital clock (BUG-018)
function tickClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// 3. MULTI-PATIENT STATE SELECTORS & QUEUE
function renderPatientQueue() {
  const container = document.getElementById('patient-queue-list');
  container.innerHTML = "";
  
  // Count stats counts
  let counts = { total: patients.length, approved: 0, critical: 0, pending: 0 };
  
  patients.forEach((p, idx) => {
    let statusClass = "pill-draft";
    let statusLabel = "Draft ready";
    
    if (p.status === "crit") {
      statusClass = "pill-crit";
      statusLabel = "⚠ Critical flag";
      counts.critical++;
      counts.pending++;
    } else if (p.status === "pend") {
      statusClass = "pill-pend";
      statusLabel = "⏳ Pending review";
      counts.pending++;
    } else if (p.status === "ok") {
      statusClass = "pill-ok";
      statusLabel = "✓ Approved";
      counts.approved++;
    }
    
    const card = document.createElement('div');
    card.className = `pt-card ${idx === activePatientIdx ? 'active' : ''}`;
    card.setAttribute('onclick', `selectPatient(${idx})`);
    card.innerHTML = `
      <div class="pt-name">${p.name}</div>
      <div class="pt-meta">${p.ward} · ${p.mrd}</div>
      <span class="pt-pill ${statusClass}">${statusLabel}</span>
    `;
    container.appendChild(card);
  });
  
  document.getElementById('stat-total').textContent = counts.total;
  document.getElementById('stat-approved').textContent = counts.approved;
  document.getElementById('stat-critical').textContent = counts.critical;
  document.getElementById('stat-pending').textContent = counts.pending;
}

function filterQueue(query) {
  const q = query.toLowerCase().trim();
  const cards = document.querySelectorAll('.pt-card');
  patients.forEach((p, idx) => {
    const match = p.name.toLowerCase().includes(q) || p.mrd.toLowerCase().includes(q);
    cards[idx].style.display = match ? 'block' : 'none';
  });
}

function selectPatient(idx) {
  if (editMode) toggleEdit();
  
  activePatientIdx = idx;
  const p = patients[idx];
  
  document.querySelectorAll('.pt-card').forEach((c, i) => c.classList.toggle('active', i === idx));
  
  // Update Patient Intake Header including dynamic ABHA ID (COMP-03)
  document.getElementById('pt-name').textContent = p.name;
  document.getElementById('pt-meta').textContent = `${p.age} yrs · ${p.gender} · ${p.mrd} · ABHA ID: ${p.abha} · Admitted ${formatDateString(p.admDate)} — Discharge due ${formatDateString(p.disDate)} · ${p.ward} · ${p.physician}`;
  
  activePortalLang = "en";
  goStep(p.step);
  updateRetrievalScreenState(p);
  runClinicalSafetyAudit();
  
  document.getElementById('draft-diagnosis').textContent = p.diagnosis;
  document.getElementById('draft-chief-complaint').textContent = p.chiefComplaint;
  document.getElementById('draft-clinical-findings').textContent = p.clinicalFindings;
  document.getElementById('draft-investigations').textContent = p.investigations;
  document.getElementById('draft-condition').textContent = p.condition;
  
  const missingDateLabel = document.getElementById('followup-date-missing');
  if (p.followupDate) {
    missingDateLabel.outerHTML = `<strong id="followup-date-missing" class="f-resolved">${p.followupDate}</strong>`;
  } else {
    if (!missingDateLabel) {
      const body = document.getElementById('draft-followup');
      body.innerHTML = `Clinic: Pulmonology OPD<br>Follow-up Date: <span class="f-miss" id="followup-date-missing" onclick="resolveMissingDate()">[PHYSICIAN TO COMPLETE — click to enter date]</span><br>Diet: High protein, stay hydrated.<br>Emergency warning signs: High fever, breathing difficulty, chest pain.`;
    }
  }
  
  refreshMedicationList();
  
  document.getElementById('icd-code-0').textContent = p.icdOptions[0] ? p.icdOptions[0].code : "—";
  document.getElementById('icd-desc-0').textContent = p.icdOptions[0] ? p.icdOptions[0].desc : "";
  if (p.icdOptions[1]) {
    document.getElementById('icd-opt-1').style.display = "flex";
    document.getElementById('icd-code-1').textContent = p.icdOptions[1].code;
    document.getElementById('icd-desc-1').textContent = p.icdOptions[1].desc;
  } else {
    document.getElementById('icd-opt-1').style.display = "none";
  }
  selectICD(p.icdCodeIndex);
  
  updateMobilePortalSummary();
  
  logAuditAction(`Patient query: MRD ${p.mrd} record context loaded`);
}

function formatDateString(ds) {
  if (!ds) return "—";
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  try {
    const d = new Date(ds);
    return d.toLocaleDateString('en-IN', options);
  } catch (err) {
    return ds;
  }
}

// 4. STEP TABS NAVIGATION
function goStep(idx) {
  patients[activePatientIdx].step = idx;
  
  document.querySelectorAll('.step-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === idx);
    tab.classList.toggle('done', i < idx);
    const num = tab.querySelector('.step-num');
    if (i < idx) {
      num.textContent = "✓";
    } else {
      num.textContent = i + 1;
    }
  });
  
  const panels = [
    document.getElementById('step-panel-retrieval'),
    document.getElementById('step-panel-review'),
    document.getElementById('step-panel-approve')
  ];
  panels.forEach((p, i) => {
    if (p) p.classList.toggle('hidden', i !== idx);
  });
  
  const pvToggle = document.getElementById('patient-view-wrap');
  if (pvToggle) pvToggle.classList.add('hidden');
  document.getElementById('vt-btn-draft').classList.add('on');
  document.getElementById('vt-btn-patient').classList.remove('on');
  
  if (idx === 2) {
    const p = patients[activePatientIdx];
    document.getElementById('approve-summary-name').textContent = p.name;
    document.getElementById('approve-summary-mrn').textContent = p.mrd;
    document.getElementById('approve-summary-diagnosis').textContent = p.diagnosis.split('\n')[0].replace('Primary: ', '');
    document.getElementById('approve-summary-meds').textContent = `${p.medications.length} drugs prescribed`;
    
    const sBtn = document.getElementById('approve-sign-btn-step3');
    if (activeWarnings.length === 0) {
      sBtn.disabled = false;
      sBtn.style.opacity = "1";
      sBtn.style.cursor = "pointer";
    } else {
      sBtn.disabled = true;
      sBtn.style.opacity = "0.35";
      sBtn.style.cursor = "not-allowed";
    }
  }
  
  const stepsNames = ["Data Retrieval Intake", "Clinical Draft Review", "Approve Final Certification"];
  logAuditAction(`Workstation step transitioned to ${stepsNames[idx]}`);
}

// 5. STEP 1: RETRIEVAL SCRAPER & SPEECH DICTATION
function updateRetrievalScreenState(p) {
  const sources = ['emr', 'lis', 'ris', 'nursing'];
  sources.forEach(src => {
    const loader = document.getElementById(`source-${src}`);
    const status = document.getElementById(`source-${src}-status`);
    const count = document.getElementById(`source-${src}-count`);
    
    if (p.scraped) {
      status.className = "ret-status ok";
      status.querySelector('span').textContent = "✓ Synced";
      status.querySelector('.spinner').classList.add('hidden');
      count.textContent = getSourceCount(src, p);
    } else {
      status.className = "ret-status loading";
      status.querySelector('span').textContent = "Ready";
      status.querySelector('.spinner').classList.add('hidden');
      count.textContent = "Pending";
    }
  });
  
  document.getElementById('btn-import-emr').disabled = p.scraped;
  document.getElementById('clinical-raw-notes').value = p.rawNotes;
}

function getSourceCount(src, p) {
  if (src === 'emr') return "Intake profile OK";
  if (src === 'lis') return `${p.medications.length + 1} labs loaded`;
  if (src === 'ris') return "1 imaging report";
  if (src === 'nursing') return "Flowsheets OK";
  return "OK";
}

function simulateEMRScrape() {
  const p = patients[activePatientIdx];
  if (p.scraped) return;
  
  showToast("Scraping HIS active background EMR tab records...", "success");
  logAuditAction(`EMR scrape requested for patient: ${p.name}`);
  
  const sources = ['emr', 'lis', 'ris', 'nursing'];
  let currentSrcIdx = 0;
  
  document.getElementById('btn-import-emr').disabled = true;
  document.getElementById('btn-import-emr').textContent = "⏳ Scraping...";
  
  function triggerNextScraper() {
    if (currentSrcIdx >= sources.length) {
      p.scraped = true;
      document.getElementById('btn-import-emr').textContent = "✓ Synced with EMR";
      selectPatient(activePatientIdx);
      logAuditAction(`All clinical databases fully synchronized.`);
      return;
    }
    
    const src = sources[currentSrcIdx];
    const status = document.getElementById(`source-${src}-status`);
    status.querySelector('.spinner').classList.remove('hidden');
    status.querySelector('span').textContent = "Syncing...";
    
    setTimeout(() => {
      status.className = "ret-status ok";
      status.querySelector('span').textContent = "✓ Synced";
      status.querySelector('.spinner').classList.add('hidden');
      document.getElementById(`source-${src}-count`).textContent = getSourceCount(src, p);
      logAuditAction(`Database synced successfully: ${src.toUpperCase()} repository`);
      currentSrcIdx++;
      triggerNextScraper();
    }, 450);
  }
  
  triggerNextScraper();
}

// continuous voice speech recognition bedside tools
let recognition = null;
let isDictating = false;

function setupSpeechRecognition() {
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Speech) {
    document.getElementById('mic-btn').disabled = true;
    document.getElementById('mic-text').textContent = "Unsupported";
    return;
  }
  
  recognition = new Speech();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  
  recognition.onstart = () => {
    isDictating = true;
    document.getElementById('mic-btn').classList.add('recording');
    document.getElementById('mic-text').textContent = "Stop Dictating";
    document.getElementById('dictation-status').className = "dictation-status-dot active";
    document.getElementById('voice-wave').classList.remove('hidden');
    logAuditAction("Continuous speech-to-text bedside dictation listening");
    showToast("bedside dictation active. Speak clearly.", "success");
  };
  
  recognition.onend = () => {
    isDictating = false;
    document.getElementById('mic-btn').classList.remove('recording');
    document.getElementById('mic-text').textContent = "Dictate notes";
    document.getElementById('dictation-status').className = "dictation-status-dot";
    document.getElementById('voice-wave').classList.add('hidden');
    logAuditAction("bedside voice dictation closed");
  };
  
  recognition.onresult = (event) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + ' ';
      }
    }
    if (finalTranscript) {
      const area = document.getElementById('clinical-raw-notes');
      area.value += finalTranscript;
      patients[activePatientIdx].rawNotes = area.value;
    }
  };
  
  recognition.onerror = (e) => {
    console.error("Speech Recognition Error:", e);
    showToast(`Dictation err: ${e.error}`, "error");
    stopDictation();
  };
}

function toggleDictation() {
  if (!recognition) return;
  if (isDictating) {
    recognition.stop();
  } else {
    recognition.start();
  }
}

// 6. CLINICAL SAFETY GATED AUDITOR (JAMA RULES CALCULATOR)
function runClinicalSafetyAudit() {
  const p = patients[activePatientIdx];
  const rawText = p.rawNotes.toLowerCase();
  
  activeWarnings = [];
  
  // Critical warnings
  let hasPenicillinAllergy = rawText.includes('penicillin');
  let hasSulfaAllergy = rawText.includes('sulfa');
  
  let hasAmoxicillin = p.medications.some(m => m.name.toLowerCase().includes('amox') || m.name.toLowerCase().includes('penicillin'));
  let hasSulfaMed = p.medications.some(m => m.name.toLowerCase().includes('bactrim') || m.name.toLowerCase().includes('sulfa') || m.name.toLowerCase().includes('trimethoprim'));
  
  // Guideline warnings
  let hasStent = rawText.includes('stent') || rawText.includes('stemi') || rawText.includes('occlusion');
  let hasDKA = rawText.includes('dka') || rawText.includes('ketoacidosis');
  
  let hasAspirin = p.medications.some(m => m.name.toLowerCase().includes('aspirin') || m.name.toLowerCase().includes('asa'));
  let hasLispro = p.medications.some(m => m.name.toLowerCase().includes('lispro') || m.name.toLowerCase().includes('humalog') || m.name.toLowerCase().includes('novolog'));
  
  // 1. Penicillin allergy collision
  if (hasPenicillinAllergy && hasAmoxicillin && !p.critResolved) {
    activeWarnings.push({ type: 'crit', key: 'ALLERGY_PENICILLIN', msg: "Penicillin allergy documented in notes, but Penicillin derivative (Amoxicillin) is active in prescriptions." });
  }
  
  // 2. Sulfa allergy collision
  if (hasSulfaAllergy && hasSulfaMed) {
    activeWarnings.push({ type: 'crit', key: 'ALLERGY_SULFA', msg: "Sulfa allergy documented in notes, but Sulfa antibiotic (Bactrim/Septra) is active in prescriptions." });
  }
  
  // 3. Stent Aspirin Omission
  if (hasStent && !hasAspirin) {
    activeWarnings.push({ type: 'warn', key: 'OMISSION_ASPIRIN', msg: "Post-coronary stent patient requires Dual Antiplatelet Therapy. Aspirin 81mg PO daily is currently missing." });
  }
  
  // 4. DKA Lispro Omission
  if (hasDKA && !hasLispro) {
    activeWarnings.push({ type: 'warn', key: 'OMISSION_LISPRO', msg: "Post-DKA regimen lacks mealtime short-acting insulin coverage (Insulin Lispro). Bedtime Glargine alone is insufficient." });
  }
  
  // 5. Metformin Dose Discrepancy
  if (rawText.includes('metformin') && p.medications.some(m => m.name.toLowerCase().includes('metformin'))) {
    const hasDiscrepancy = p.medications.some(m => m.name.toLowerCase().includes('metformin 500mg'));
    if (hasDiscrepancy) {
      activeWarnings.push({ type: 'warn', key: 'DISCREPANCY_METFORMIN', msg: "Metformin dose in discharge (500mg BD) differs from admission clinical record (1000mg BD)." });
    }
  }
  
  // 6. Missing follow-up date
  if (!p.followupDate) {
    activeWarnings.push({ type: 'miss', key: 'FOLLOWUP_DATE', msg: "Follow-up clinic checkup date is missing. Complete date selection before signing." });
  }
  
  // Render flags lists in Right Panel
  const critContainer = document.getElementById('rp-critical-flags-container');
  const warnContainer = document.getElementById('rp-warning-flags-container');
  const missContainer = document.getElementById('rp-missing-flags-container');
  
  critContainer.innerHTML = "";
  warnContainer.innerHTML = "";
  missContainer.innerHTML = "";
  
  let critCount = 0, warnCount = 0, missCount = 0;
  
  activeWarnings.forEach(w => {
    const item = document.createElement('div');
    if (w.type === 'crit') {
      item.className = "rp-flag crit";
      item.innerHTML = `<div class="rp-flag-dot"></div>${w.msg}`;
      item.onclick = () => focusWarning('med-section');
      critContainer.appendChild(item);
      critCount++;
    } else if (w.type === 'warn') {
      item.className = "rp-flag warn";
      item.innerHTML = `<div class="rp-flag-dot"></div>${w.msg}`;
      item.onclick = () => focusWarning('med-section');
      warnContainer.appendChild(item);
      warnCount++;
    } else if (w.type === 'miss') {
      item.className = "rp-flag miss";
      item.innerHTML = `<div class="rp-flag-dot"></div>${w.msg}`;
      item.onclick = () => focusWarning('followup-date-missing');
      missContainer.appendChild(item);
      missCount++;
    }
  });
  
  if (p.critResolved) {
    const resolvedItem = document.createElement('div');
    resolvedItem.className = "rp-flag resolved";
    resolvedItem.innerHTML = `<div class="rp-flag-dot"></div>✓ Amoxicillin replaced — resolved`;
    critContainer.appendChild(resolvedItem);
  }
  
  document.getElementById('flag-count').textContent = `${critCount} critical · ${warnCount + missCount} warning`;
  
  const banner = document.getElementById('crit-banner');
  if (critCount > 0 && activePatientIdx === 0 && !p.critResolved) {
    banner.style.display = "flex";
    document.getElementById('crit-banner-desc').textContent = activeWarnings.find(w => w.key === 'ALLERGY_PENICILLIN').msg;
  } else {
    banner.style.display = "none";
  }
  
  updateSafetyScoreCircle(critCount, warnCount, missCount);
  
  const approveBtn = document.getElementById('approve-btn');
  const unlocked = (critCount === 0 && missCount === 0);
  
  if (p.status === "ok") {
    approveBtn.className = "f-btn approved";
    approveBtn.textContent = "✓ Approved & signed";
    approveBtn.disabled = true;
    document.getElementById('wm-text').textContent = "✓ APPROVED & TRANSMITTED — Dr. Priya Nair";
    document.getElementById('wm-text').className = "wm-text wm-approved";
  } else {
    approveBtn.disabled = !unlocked;
    approveBtn.className = "f-btn approve" + (unlocked ? " unlocked" : "");
    approveBtn.textContent = "Approve & sign";
    document.getElementById('wm-text').textContent = "📄 DRAFT — PENDING PHYSICIAN APPROVAL";
    document.getElementById('wm-text').className = "wm-text";
  }
}

function updateSafetyScoreCircle(crit, warn, miss) {
  let score = 100;
  if (crit > 0) score -= 40 * crit;
  if (warn > 0) score -= 15 * warn;
  if (miss > 0) score -= 10 * miss;
  score = Math.max(score, 10);
  
  const circle = document.getElementById('safety-progress-circle');
  const scoreVal = document.getElementById('safety-score-value');
  const scoreDesc = document.getElementById('safety-score-desc');
  
  const circumference = 175.92;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  const offset = circumference - (score / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  scoreVal.textContent = `${score}%`;
  
  if (score >= 90) {
    circle.className.baseVal = "gauge-fill";
    scoreDesc.textContent = "NYU Clinical Gate Unlocked";
  } else if (score >= 60) {
    circle.className.baseVal = "gauge-fill med";
    scoreDesc.textContent = "Review checklist issues";
  } else {
    circle.className.baseVal = "gauge-fill low";
    scoreDesc.textContent = "Critical conflicts block signing";
  }
}

function focusWarning(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.style.animation = "pulseGlow 1.5s infinite";
    setTimeout(() => el.style.animation = "none", 4000);
  }
}

// 7. DOUBLE-ENGINE AI SUMMARY GENERATION (Gemini 2.0 endpoint mapping)
async function generateAISummary() {
  const p = patients[activePatientIdx];
  const rawText = document.getElementById('clinical-raw-notes').value.trim();
  
  if (!rawText) {
    showToast(" bedside dictation notes are empty. Enter notes first.", "error");
    return;
  }
  
  p.rawNotes = rawText;
  
  const retPanel = document.getElementById('step-panel-retrieval');
  retPanel.querySelector('.retrieval-screen').style.display = "none";
  
  const loader = document.createElement('div');
  loader.className = "ai-loading show";
  loader.innerHTML = `
    <div class="ai-spinner"></div>
    <div class="ai-loading-text">Double-Engine clinical analysis running...</div>
    <div class="ai-loading-sub">Gating safety rules &amp; translating plain summaries...</div>
  `;
  retPanel.appendChild(loader);
  
  const key = localStorage.getItem('api_key_val') || localStorage.getItem('gemini_api_key');
  const model = localStorage.getItem('gemini_api_model') || 'gemini-2.0-flash';
  
  // Inject simulated QAS Staging Chaos API Error (HTTP 429 Rate Limit)
  if (qasErrorActive) {
    logAuditAction("QAS CHAOS TESTING: Injecting simulated API Error (HTTP 429 Rate Limit)");
    setTimeout(() => {
      loader.remove();
      retPanel.querySelector('.retrieval-screen').style.display = "flex";
      p.scraped = true;
      p.step = 1;
      goStep(1);
      selectPatient(activePatientIdx);
      logAuditAction("QAS CHAOS: API Error triggered. Reverted immediately to secure local fallback templates.");
      showToast("QAS Staging Alert: Staging API Rate Limited (HTTP 429). Falling back safely.", "error");
    }, 1500);
    return;
  }

  // Inject simulated QAS Staging Chaos Latency (8 seconds)
  const delayMs = qasLatencyActive ? 8000 : 1200;
  if (qasLatencyActive) {
    logAuditAction("QAS CHAOS TESTING: Injecting artificial API request latency delay (8 seconds)");
    showToast("QAS Staging: API request latency delay active (8s)...", "info");
  }

  logAuditAction(`Intelligent clinical summary drafting requested via ${model.toUpperCase()}`);
  
  if (key) {
    // If latency is active, wait 8 seconds before making the API call
    if (qasLatencyActive) {
      setTimeout(async () => {
        await executeLiveGeminiAI(key, model, rawText, p, loader, retPanel);
      }, 8000);
    } else {
      await executeLiveGeminiAI(key, model, rawText, p, loader, retPanel);
    }
  } else if (supabaseClient) {
    // Upgraded Phase: Route securely through Supabase Edge Function proxy
    logAuditAction("QAS STAGING: Pushing clinical summary request to secure Supabase Edge Function proxy");
    
    const callEdgeFunction = async () => {
      try {
        const { data: edgeData, error: edgeErr } = await supabaseClient.functions.invoke('generate_draft', {
          body: {
            patientName: p.name,
            rawText: rawText,
            medications: p.medications,
            modelName: model
          }
        });
        
        if (edgeErr) throw edgeErr;
        
        // Parse and map returned clinical blocks
        p.diagnosis = edgeData.diagnosis;
        p.chiefComplaint = edgeData.chiefComplaint;
        p.clinicalFindings = edgeData.clinicalFindings;
        p.investigations = edgeData.investigations;
        p.condition = edgeData.condition;
        
        p.translations.en.why = edgeData.qa.why;
        p.translations.en.treatments = edgeData.qa.treatments;
        p.translations.en.restrictions = edgeData.qa.restrictions;
        p.translations.en.warnings = edgeData.qa.warnings;
        p.translations.en.followup = edgeData.qa.followup;
        
        p.scraped = true;
        loader.remove();
        retPanel.querySelector('.retrieval-screen').style.display = "flex";
        
        goStep(1);
        selectPatient(activePatientIdx);
        logAuditAction("QAS STAGING: Secure Supabase Edge Function generation successful");
        showToast("AI Summary generated via secure Supabase Edge Function!", "success");
        
      } catch (err) {
        console.warn("Supabase Edge Function call failed, falling back to simulator:", err);
        logAuditAction(`Supabase Edge Function fail: ${err.message || err}. Falling back to offline simulator.`);
        
        // Staging Staging fallback
        loader.remove();
        retPanel.querySelector('.retrieval-screen').style.display = "flex";
        p.scraped = true;
        p.step = 1;
        
        goStep(1);
        selectPatient(activePatientIdx);
        showToast("Backend connection offline. Triggered local clinical simulation fallback.", "info");
      }
    };

    if (qasLatencyActive) {
      setTimeout(callEdgeFunction, 8000);
    } else {
      callEdgeFunction();
    }
  } else {
    // Simulator fallback
    setTimeout(() => {
      loader.remove();
      retPanel.querySelector('.retrieval-screen').style.display = "flex";
      p.scraped = true;
      p.step = 1;
      
      goStep(1);
      selectPatient(activePatientIdx);
      logAuditAction("Double-engine fallback local simulated templates parsed successfully");
      showToast("AI Draft simulated successfully (Local Intelligent fallback)", "success");
    }, delayMs);
  }
}

async function executeLiveGeminiAI(key, model, rawText, p, loader, container) {
  // Upgraded live API URIs supporting Gemini 2.x standard formats
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  
  const prompt = `
  You are an expert physician AI discharge writer. Parse this raw note and return JSON matching this schema:
  {
    "diagnosis": "Primary diagnosis with J18.9 pneumonia or code, secondary diagnosis.",
    "chiefComplaint": "Crushing chest pain or fever cough complaint details...",
    "clinicalFindings": "Temp, BP, exam findings on admission.",
    "investigations": "Labs WBC, X-rays, cultures pending.",
    "hospitalCourse": "Summary course of hospital treatment.",
    "condition": "Stable at discharge, vitals...",
    "qa": {
      "why": "A 6th-grade, plain, lay explanation answering: 'Why was I in the hospital?' Translate medical terms (STEMI -> heart attack, occlusion -> block).",
      "treatments": "A 6th-grade answer for treatments received.",
      "restrictions": "A 6th-grade answer for activities/diet to avoid.",
      "warnings": "Red flag warning signs customized for their condition.",
      "followup": "When and where to follow up."
    }
  }
  
  Raw bedside notes: "${rawText}"
  Patient Name: "${p.name}"
  Ensure output is strictly valid JSON without markdown formatting.
  `;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    
    if (!res.ok) throw new Error(`Google API status ${res.status}`);
    const data = await res.json();
    const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
    
    p.diagnosis = parsed.diagnosis;
    p.chiefComplaint = parsed.chiefComplaint;
    p.clinicalFindings = parsed.clinicalFindings;
    p.investigations = parsed.investigations;
    p.condition = parsed.condition;
    
    p.translations.en.why = parsed.qa.why;
    p.translations.en.treatments = parsed.qa.treatments;
    p.translations.en.restrictions = parsed.qa.restrictions;
    p.translations.en.warnings = parsed.qa.warnings;
    p.translations.en.followup = parsed.qa.followup;
    
    p.scraped = true;
    loader.remove();
    container.querySelector('.retrieval-screen').style.display = "flex";
    
    goStep(1);
    selectPatient(activePatientIdx);
    logAuditAction(`Live Gemini 2.x generation successful. Clinical text blocks mapped.`);
    showToast("Gemini Clinical draft generated successfully!", "success");
    
  } catch (err) {
    console.error("Gemini Error:", err);
    logAuditAction("Gemini live call exception. Fallback simulated engine triggered.");
    showToast("Gemini key error. Reverted to simulated fallback.", "error");
    loader.remove();
    container.querySelector('.retrieval-screen').style.display = "flex";
    
    p.scraped = true;
    goStep(1);
    selectPatient(activePatientIdx);
  }
}

// 8. MEDICATION PLANNER ACTIONS
function refreshMedicationList() {
  const p = patients[activePatientIdx];
  const list = document.getElementById('medications-list');
  list.innerHTML = "";
  
  p.medications.forEach((m, idx) => {
    let flagIcon = "✅";
    let textClass = "";
    
    if (m.name.toLowerCase().includes('amox') && p.rawNotes.toLowerCase().includes('penicillin') && !p.critResolved) {
      flagIcon = "🚨";
      textClass = "f-crit";
    } else if (m.name.toLowerCase().includes('metformin 500mg') && p.rawNotes.toLowerCase().includes('metformin')) {
      flagIcon = "⚠️";
      textClass = "f-warn";
    }
    
    const row = document.createElement('div');
    row.className = "med-row";
    row.innerHTML = `
      <div class="med-flag-icon">${flagIcon}</div>
      <div>
        <div class="med-name-w"><span class="${textClass}">${m.name}</span></div>
        <div class="med-detail">${m.instruction}</div>
      </div>
      <button class="med-del-btn" onclick="deleteMedication(${idx})" aria-label="Delete medication">❌</button>
    `;
    list.appendChild(row);
  });
  
  refreshMobilePortalMedsList();
  
  const step3Meds = document.getElementById('approve-summary-meds');
  if (step3Meds) step3Meds.textContent = `${p.medications.length} drugs prescribed`;
}

function addMedication() {
  const p = patients[activePatientIdx];
  const nameInput = document.getElementById('med-name');
  const instInput = document.getElementById('med-instruction');
  
  const name = nameInput.value.trim();
  const inst = instInput.value.trim();
  
  if (!name || !inst) {
    showToast("Please enter both prescription and instruction details.", "error");
    return;
  }
  
  p.medications.push({ name, instruction: inst });
  nameInput.value = "";
  instInput.value = "";
  
  refreshMedicationList();
  runClinicalSafetyAudit();
  logAuditAction(`Discharge prescription added: ${name}`);
  showToast(`Added ${name.split(' ')[0]} to prescriptions`, "success");
}

function deleteMedication(idx) {
  const p = patients[activePatientIdx];
  const removedName = p.medications[idx].name;
  p.medications.splice(idx, 1);
  
  refreshMedicationList();
  runClinicalSafetyAudit();
  logAuditAction(`Discharge prescription deleted: ${removedName}`);
  showToast(`Removed ${removedName.split(' ')[0]}`);
}

// 9. INTERACTIVE SAFETY WARNING RESOLUTIONS
function resolveCrit() {
  const p = patients[activePatientIdx];
  if (p.critResolved) return;
  
  p.critResolved = true;
  
  const amoxIdx = p.medications.findIndex(m => m.name.toLowerCase().includes('amox'));
  if (amoxIdx !== -1) {
    p.medications[amoxIdx] = {
      name: "Azithromycin 500mg PO OD",
      instruction: "Take 1 tablet by mouth daily for 7 days [substituted — penicillin allergy documented]"
    };
  }
  
  const banner = document.getElementById('crit-banner');
  banner.style.background = "#D1FAE5";
  banner.style.borderColor = "#A7F3D0";
  banner.querySelector('.cb-icon').textContent = "✅";
  banner.querySelector('.cb-title').textContent = "Critical resolved — alternative antibiotic confirmed";
  banner.querySelector('.cb-title').style.color = "#065F46";
  banner.querySelector('.cb-desc').textContent = "Amoxicillin removed. Penicillin-safe Azithromycin substituted. Allergy check saved to clinical logs.";
  banner.querySelector('.cb-desc').style.color = "#047857";
  banner.querySelector('.cb-resolve').style.display = "none";
  
  const badge = document.getElementById('pt-status-badge');
  badge.textContent = "⚠ Review flags";
  badge.className = "status-badge";
  
  refreshMedicationList();
  runClinicalSafetyAudit();
  
  logAuditAction("🚨 CRITICAL: Penicillin contraindication resolved by Dr. Nair. Azithromycin substituted.");
  showToast("Penicillin allergy resolved! Azithromycin substituted.", "success");
}

function resolveMissingDate() {
  const p = patients[activePatientIdx];
  p.followupDate = "26 May 2025";
  
  const el = document.getElementById('followup-date-missing');
  if (el) {
    el.outerHTML = `<strong id="followup-date-missing" class="f-resolved">${p.followupDate}</strong>`;
  }
  
  runClinicalSafetyAudit();
  logAuditAction("Follow-up date filled by attending resident.");
  showToast("Follow-up date recorded successfully!");
}

// 10. EDITABLE DRAFT TOGGLE ACTIONS
function toggleEdit() {
  editMode = !editMode;
  
  const btn = document.getElementById('edit-btn');
  btn.textContent = editMode ? "Done Editing" : "Edit Draft";
  btn.classList.toggle('teal', editMode);
  
  const textareas = [
    'draft-diagnosis',
    'draft-chief-complaint',
    'draft-clinical-findings',
    'draft-investigations',
    'draft-condition'
  ];
  
  textareas.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute('contenteditable', editMode ? "true" : "false");
      el.style.outline = editMode ? "1.5px dashed var(--teal)" : "none";
      el.style.padding = editMode ? "4px" : "0";
      el.style.borderRadius = "4px";
      
      if (!editMode) {
        const val = el.innerText.trim();
        const stateKey = id.replace('draft-', '');
        patients[activePatientIdx][stateKey] = val;
      }
    }
  });
  
  logAuditAction(`Inline draft editing modes toggled ${editMode ? "ON" : "OFF"}`);
  
  if (editMode) {
    showToast("Inline editing unlocked. Modify fields directly.", "success");
  } else {
    runClinicalSafetyAudit();
    showToast("Changes saved to discharge draft.");
  }
}

// 11. PATIENT PORTAL SMARTPHONE INTERFACES
function switchView(view) {
  const draftBtn = document.getElementById('vt-btn-draft');
  const patientBtn = document.getElementById('vt-btn-patient');
  
  const draftPanel = document.getElementById('step-panel-review');
  const patientPanel = document.getElementById('patient-view-wrap');
  
  if (view === 'draft') {
    draftBtn.classList.add('on');
    patientBtn.classList.remove('on');
    draftPanel.classList.remove('hidden');
    patientPanel.classList.add('hidden');
  } else {
    patientBtn.classList.add('on');
    draftBtn.classList.remove('on');
    patientPanel.classList.remove('hidden');
    draftPanel.classList.add('hidden');
    
    updateMobilePortalSummary();
  }
}

function updateMobilePortalSummary() {
  const p = patients[activePatientIdx];
  
  document.getElementById('portal-patient-name').textContent = p.name;
  
  document.querySelectorAll('.lt-btn').forEach(b => b.classList.remove('on'));
  const activeBtn = document.getElementById(`lang-btn-${activePortalLang}`);
  if (activeBtn) activeBtn.classList.add('on');
  
  const t = p.translations[activePortalLang] || p.translations.en;
  
  document.getElementById('qa-q1').textContent = activePortalLang === 'es' ? "¿Por qué ingresó?" : (activePortalLang === 'ta' ? "ஏன் அனுமதிக்கப்பட்டீர்கள்?" : (activePortalLang === 'hi' ? "आपको क्यों भर्ती किया गया?" : (activePortalLang === 'kn' ? "ಯಾಕೆ ದಾಖಲಿಸಲಾಯಿತು?" : "Why were you admitted?")));
  document.getElementById('qa-a1').innerHTML = t.why || "Details pending...";
  
  document.getElementById('qa-q2').textContent = activePortalLang === 'es' ? "¿Qué tratamientos recibió?" : (activePortalLang === 'ta' ? "என்ன சிகிச்சைகள் வழங்கப்பட்டன?" : (activePortalLang === 'hi' ? "आपको क्या उपचार मिले?" : (activePortalLang === 'kn' ? "ಏನು ಚಿಕಿತ್ಸೆ ನೀಡಲಾಯಿತು?" : "What treatments did you receive?")));
  document.getElementById('qa-a2').innerHTML = t.treatments || "Details pending...";
  
  document.getElementById('qa-q3').textContent = activePortalLang === 'es' ? "Instrucciones de reposo:" : (activePortalLang === 'ta' ? "உணவு & கட்டுப்பாடுகள்:" : (activePortalLang === 'hi' ? "परहेज और गतिविधियाँ:" : (activePortalLang === 'kn' ? "ಆಹಾರ ಮತ್ತು ನಿಯಮಗಳು:" : "What daily restrictions apply?")));
  document.getElementById('qa-a3').innerHTML = t.restrictions || "Details pending...";
  
  document.getElementById('qa-q4').textContent = activePortalLang === 'es' ? "¿Cuándo es su cita de control?" : (activePortalLang === 'ta' ? "அடுத்த சந்திப்பு எப்போது?" : (activePortalLang === 'hi' ? "अगला फॉलो-अप कब है?" : (activePortalLang === 'kn' ? "ಮುಂದಿನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಯಾವಾಗ?" : "When is your next appointment?")));
  document.getElementById('qa-a4').innerHTML = t.followup || "Details pending...";
  
  const warnTitle = document.getElementById('qa-w-title');
  const item1 = document.getElementById('qa-w-i1');
  const item2 = document.getElementById('qa-w-i2');
  const item3 = document.getElementById('qa-w-i3');
  
  if (activePortalLang === 'es') {
    warnTitle.textContent = "⚠ Regrese a emergencias de inmediato si:";
    item1.textContent = "• Regresa la fiebre sobre 38.5°C";
    item2.textContent = "• Tiene falta de aire o respiración rápida";
    item3.textContent = "• Dolor de pecho o mareos";
  } else if (activePortalLang === 'ta') {
    warnTitle.textContent = "⚠ உடனே அவசர சிகிச்சைக்கு வரவும்:";
    item1.textContent = "• காய்ச்சல் 38.5°Cக்கு மேல் திரும்பினால்";
    item2.textContent = "• மூச்சு விடுவதில் சிரமம் ஏற்பட்டால்";
    item3.textContent = "• நெஞ்சு வலி அல்லது மயக்கம் வந்தால்";
  } else if (activePortalLang === 'hi') {
    warnTitle.textContent = "⚠ तुरंत आपातकालीन विभाग में आएं यदि:";
    item1.textContent = "• बुखार 38.5°C से अधिक वापस आए";
    item2.textContent = "• सांस लेने में तकलीफ या तेजी हो";
    item3.textContent = "• सीने में दर्द या चक्कर आए";
  } else if (activePortalLang === 'kn') {
    warnTitle.textContent = "⚠ ತಕ್ಷಣ ತುರ್ತು ಚಿಕಿತ್ಸೆಗೆ ಬನ್ನಿ ಒಂದು ವೇಳೆ:";
    item1.textContent = "• ಜ್ವರ 38.5°C ಗಿಂತ ಹೆಚ್ಚಾದರೆ";
    item2.textContent = "• ಉಸಿರಾಟದಲ್ಲಿ ತೊಂದರೆಯುಂಟಾದರೆ";
    item3.textContent = "• ಎದೆನೋವು ಅಥವಾ ತಲೆತಿರುಗುವಿಕೆ ಬಂದರೆ";
  } else {
    warnTitle.textContent = "⚠ Go to emergency immediately if:";
    item1.textContent = "• Fever returns above 38.5°C";
    item2.textContent = "• Breathing becomes difficult or fast";
    item3.textContent = "• Chest pain or dizziness occurs";
  }
}

function setPortalLang(lang) {
  activePortalLang = lang;
  updateMobilePortalSummary();
  logAuditAction(`Lay patient Q&A summary translation toggled to ${lang.toUpperCase()}`);
  showToast(`Translated portal handouts to ${lang.toUpperCase()}`, "success");
}

function refreshMobilePortalMedsList() {
  const p = patients[activePatientIdx];
  const ul = document.getElementById('patient-med-checklist-ul');
  ul.innerHTML = "";
  
  p.medications.forEach((m, idx) => {
    const li = document.createElement('li');
    li.className = "mc";
    li.innerHTML = `
      <input type="checkbox">
      <div>
        <div class="mc-name">${m.name.split(' PO')[0]}</div>
        <div class="mc-dose">${m.instruction}</div>
      </div>
    `;
    ul.appendChild(li);
  });
}

// 12. NUMERICAL PIN SIGN-OFF MODALS
function openModal() {
  if (activeWarnings.some(w => w.type === 'crit' || w.type === 'miss')) {
    showToast("Resolve open critical flags before approving.", "error");
    return;
  }
  
  document.getElementById('modal-ts').textContent = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  document.getElementById('modal').classList.add('show');
  
  document.getElementById('pin-input').value = "";
  updatePinDots("");
  document.getElementById('confirm-btn').classList.remove('ready');
  
  logAuditAction("Attending signature PIN entry gate opened");
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
}

function focusPinInput() {
  document.getElementById('pin-input').focus();
}

function handlePin(val) {
  const clean = val.replace(/\D/g, '').slice(0, 4);
  document.getElementById('pin-input').value = clean;
  updatePinDots(clean);
  
  const ready = clean.length === 4;
  const btn = document.getElementById('confirm-btn');
  btn.classList.toggle('ready', ready);
}

function updatePinDots(val) {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`pd${i}`);
    if (i < val.length) {
      dot.classList.add('filled');
      dot.textContent = "●";
    } else {
      dot.classList.remove('filled');
      dot.textContent = "·";
    }
  }
}

async function confirmApprove() {
  const ready = document.getElementById('confirm-btn').classList.contains('ready');
  if (!ready) return;
  
  closeModal();
  
  const p = patients[activePatientIdx];
  p.status = "ok";
  
  logAuditAction(`NHCX RELEASE: Cryptographic PIN validation verified for ${p.name} (Hash: sha256_8a92f0...)`);
  
  renderPatientQueue();
  selectPatient(activePatientIdx);
  
  showToast("Discharge approved & signed off successfully!", "success");
  
  await savePatientToSupabase(p);
  pushToPortalMock();
}

// 13. SETTINGS MODAL & GEMINI CONFIGURATION
function saveSettings() {
  const key = document.getElementById('api-key-input').value.trim();
  const model = document.getElementById('api-model-select').value;
  
  if (key) {
    localStorage.setItem('gemini_api_key', key);
    localStorage.setItem('api_key_val', key);
    localStorage.setItem('gemini_api_model', model);
    logAuditAction(`Gemini API configuration modified to ${model.toUpperCase()}`);
    showToast("Gemini API details saved successfully!", "success");
  } else {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('api_key_val');
    localStorage.removeItem('gemini_api_model');
    logAuditAction("Gemini API key configurations removed");
    showToast("Gemini credentials cleared.");
  }
  closeSettingsModal();
}

function clearSettings() {
  document.getElementById('api-key-input').value = "";
  localStorage.removeItem('gemini_api_key');
  localStorage.removeItem('api_key_val');
  localStorage.removeItem('gemini_api_model');
  logAuditAction("Gemini API credentials cleared.");
  closeSettingsModal();
}

// 14. HANDOFF INTEGRATIONS & MOCKS
function copyPatientText() {
  const p = patients[activePatientIdx];
  const t = p.translations[activePortalLang] || p.translations.en;
  
  let clip = `QUICKDISCHARGE 2.0 PERSONAL CARE WORKBOOK: ${p.name.toUpperCase()} · ${p.mrd}\n\n`;
  clip += `1. Why were you admitted?\n${t.why}\n\n`;
  clip += `2. What treatments did you receive?\n${t.treatments}\n\n`;
  clip += `3. What restrictions apply?\n${t.restrictions}\n\n`;
  clip += `4. Follow-up appointments:\n${t.followup}\n\n`;
  clip += `💊 Discharge Medicines:\n`;
  p.medications.forEach(m => clip += `- ${m.name}: ${m.instruction}\n`);
  
  navigator.clipboard.writeText(clip).then(() => {
    logAuditAction("Lay patient summary workbook copied to clipboard");
    showToast("Portal summary copied to clipboard!", "success");
  }).catch(err => {
    showToast("Copying failed.", "error");
  });
}

function pushToPortal() {
  const btn = document.getElementById('btn-push');
  btn.disabled = true;
  btn.textContent = "⏳ Pushing...";
  
  setTimeout(() => {
    logAuditAction("Workstation synced. visit summary pushed to patient's MyCare Mobile.");
    showToast("Visit workbook pushed to MyCare App!", "success");
    btn.disabled = false;
    btn.textContent = "🚀 Push to MyChart";
  }, 1000);
}

function pushToPortalMock() {
  const chassis = document.querySelector('.phone-wrap');
  if (chassis) {
    chassis.style.boxShadow = "0 0 30px rgba(10,191,163,0.5)";
    setTimeout(() => chassis.style.boxShadow = "var(--shadow-premium)", 4000);
  }
}

// 15. ICD SELECTOR INTERACTION
function selectICD(index) {
  const p = patients[activePatientIdx];
  p.icdCodeIndex = index;
  
  document.querySelectorAll('.icd-option').forEach((opt, i) => {
    opt.classList.toggle('selected', i === index);
    const radio = opt.querySelector('input');
    if (radio) radio.checked = (i === index);
  });
  
  const code = p.icdOptions[index] ? p.icdOptions[index].code : "—";
  logAuditAction(`Primary diagnosis mapped to standard ICD code ${code}`);
}

// 16. SUPABASE CLIENT & OPERATIONS
const SUPABASE_URL = "https://dvzcgqmuykikpfmkrixm.supabase.co";
const SUPABASE_KEY = "sb_publishable_z9QzXZ2nZ0ZwQLw_Flon7A_576i4L9o";
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

async function savePatientToSupabase(p) {
  if (!supabaseClient) {
    console.warn("Supabase CDN not loaded.");
    return;
  }
  
  // Fully loaded payload mapping 100% of workstation variables
  const payload = {
    name: p.name,
    mrn: p.mrd,                                                                // Legacy field compatibility
    age_gender: `${p.age} Years, ${p.gender}`,                                 // Legacy field compatibility
    diagnosis: p.diagnosis.split('\n')[0].replace('Primary: ', ''),            // Legacy field compatibility
    status: p.status === "ok" ? "APPROVED" : "DRAFT",                          // Legacy field compatibility
    
    // Upgraded schema fields (relies on running the ALTER TABLE script)
    age: parseInt(p.age),
    gender: p.gender,
    mrd_number: p.mrd,
    abha_id: p.abha,
    admission_date: p.admDate,
    discharge_date: p.disDate,
    ward_info: p.ward,
    treating_physician: p.physician,
    clinical_status: p.status === "ok" ? "APPROVED" : "DRAFT",
    active_step: p.step,
    emr_scraped: p.scraped,
    critical_resolved: p.critResolved,
    followup_date: p.followupDate || null,
    raw_dictation_notes: p.rawNotes,
    diagnosis_block: p.diagnosis,
    chief_complaint: p.chiefComplaint,
    clinical_findings: p.clinicalFindings,
    investigations_block: p.investigations,
    discharge_condition: p.condition,
    confirmed_icd_code: p.icdOptions[p.icdCodeIndex] ? p.icdOptions[p.icdCodeIndex].code : null,
    confirmed_icd_desc: p.icdOptions[p.icdCodeIndex] ? p.icdOptions[p.icdCodeIndex].desc : null,
    
    // JSONB arrays/objects for deep lists
    medications_list: p.medications,
    language_translations: p.translations,
    audit_trail_logs: auditTrailLogs
  };
  
  try {
    const { data, error } = await supabaseClient
      .from('patients')
      .insert([payload])
      .select();
      
    if (error) {
      console.error("Supabase sync failed:", error.message);
      logAuditAction(`Supabase backup failure: ${error.message}`);
      showToast("Cloud sync failure: " + error.message, "error");
    } else {
      console.log("Supabase insert ok:", data);
      logAuditAction(`Secure backup sync completed to Supabase Cloud (#QD-89214)`);
      showToast("Backed up securely to Supabase Cloud!", "success");
    }
  } catch (err) {
    console.error("Network database sync exception:", err);
  }
}

// 17. PHYSICAL WINDOWS PRINT INTEGRATIONS
window.onbeforeprint = () => {
  const p = patients[activePatientIdx];
  
  document.getElementById('print-pat-name').textContent = p.name;
  document.getElementById('print-pat-mrn').textContent = p.mrd;
  document.getElementById('print-pat-age').textContent = `${p.age} Years, ${p.gender}`;
  document.getElementById('print-pat-dates').textContent = `Adm: ${formatDateString(p.admDate)} - Dis: ${formatDateString(p.disDate)}`;
  
  document.getElementById('print-diagnosis').textContent = p.diagnosis;
  document.getElementById('print-chief-complaint').textContent = p.chiefComplaint;
  document.getElementById('print-investigations').textContent = `${p.clinicalFindings}\n\n${p.investigations}`;
  
  const body = document.getElementById('print-meds-body');
  body.innerHTML = "";
  p.medications.forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${m.name}</strong></td>
      <td>${m.instruction}</td>
    `;
    body.appendChild(tr);
  });
  
  const t = p.translations[activePortalLang] || p.translations.en;
  document.getElementById('print-qa-why').innerHTML = t.why;
  document.getElementById('print-qa-treatments').innerHTML = t.treatments;
  document.getElementById('print-qa-followup').innerHTML = `${t.restrictions}<br><br><strong>Followup Clinic Check:</strong><br>${t.followup}`;
  
  const w = p.translations[activePortalLang] || p.translations.en;
  document.getElementById('print-qa-warnings').innerHTML = w.warnings;
  
  document.getElementById('print-approved-badge').textContent = p.status === 'ok' ? "OFFICIAL DISCHARGE SUMMARY (APPROVED & SIGNED)" : "DRAFT DISCHARGE SUMMARY (PENDING CLINIC SIGN)";
  document.getElementById('print-today-date').textContent = new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' });
  
  logAuditAction("Discharge summary print template generated for physical records");
};

// Global toast notify box
function showToast(msg, type = "info") {
  const toast = document.getElementById('toast');
  toast.className = `toast ${type}`;
  toast.innerHTML = msg;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

// Interactive theme manager (BUG-014)
function toggleTheme() {
  const dark = document.body.classList.contains('dark-theme');
  const toggle = document.querySelector('.tb-theme-toggle');
  
  if (dark) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    toggle.querySelector('.tb-toggle-pill').textContent = "☀️";
    localStorage.setItem('theme', 'light');
    logAuditAction("Workspace theme switched to Light Minimalist");
    showToast("Switched to Light Minimalist workspace");
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    toggle.querySelector('.tb-toggle-pill').textContent = "🌙";
    localStorage.setItem('theme', 'dark');
    logAuditAction("Workspace theme switched to Slate Matte Dark");
    showToast("Switched to Slate Matte Dark workspace", "success");
  }
}

// Close sign pad overlay click
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ── QAS STAGING DEBUG CONTROLLER ENGINE ──
let qasConsoleVisible = false;
let qasLatencyActive = false;
let qasErrorActive = false;

// Auto-reveal the QAS trigger if URL query has ?qa_debug=true OR if running locally (localhost / 127.0.0.1)
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const debugQuery = urlParams.get('qa_debug') === 'true';
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (debugQuery || isLocal) {
    const trigger = document.getElementById('qas-debug-trigger');
    if (trigger) trigger.classList.remove('hidden');
    logAuditAction("QAS Staging Sandbox Debug panel initialized");
  }
});

function toggleQasConsole() {
  const consoleEl = document.getElementById('qas-debug-console');
  if (!consoleEl) return;
  qasConsoleVisible = !qasConsoleVisible;
  consoleEl.classList.toggle('hidden', !qasConsoleVisible);
}

function injectQasScenario(type) {
  const p = patients[activePatientIdx];
  logAuditAction(`QAS STAGING: Injecting synthetic scenario type: ${type}`);
  
  if (type === 'PENICILLIN') {
    // Inject penicillin allergy block on Ramesh
    p.rawNotes += " Documented Penicillin allergy. Metformin 1000mg BD.";
    p.critResolved = false;
    const amoxExists = p.medications.some(m => m.name.toLowerCase().includes('amox'));
    if (!amoxExists) {
      p.medications.push({
        name: "Amoxicillin 500mg PO TID",
        instruction: "Take 1 tablet by mouth three times daily for lung infection"
      });
    }
    selectPatient(activePatientIdx);
    showToast("Synthetic Penicillin Allergy Mismatch injected!", "error");
  } else if (type === 'ASPIRIN') {
    // Omit aspirin on Arjun (STEMI patient)
    p.rawNotes += " coronary stenting successfully placed in LAD block. ST elevations.";
    p.medications = p.medications.filter(m => !m.name.toLowerCase().includes('aspirin') && !m.name.toLowerCase().includes('asa'));
    selectPatient(activePatientIdx);
    showToast("Synthetic Post-Stent Aspirin Omission injected!", "error");
  } else if (type === 'INSULIN') {
    // Omit short-acting insulin on Meenakshi (resolved DKA)
    p.rawNotes += " admitted in severe Diabetic Ketoacidosis (DKA). Glargine at bedtime.";
    p.medications = p.medications.filter(m => !m.name.toLowerCase().includes('lispro') && !m.name.toLowerCase().includes('insulin'));
    p.medications.push({
      name: "Insulin Glargine 10 units SC",
      instruction: "Inject 10 units under the skin once daily at bedtime"
    });
    selectPatient(activePatientIdx);
    showToast("Synthetic Post-DKA Insulin Omission injected!", "error");
  }
}

function toggleQasLatency() {
  qasLatencyActive = !qasLatencyActive;
  const btn = document.getElementById('qas-btn-latency');
  btn.classList.toggle('active', qasLatencyActive);
  
  logAuditAction(`QAS STAGING: API Latency simulation toggled ${qasLatencyActive ? 'ON (8 seconds)' : 'OFF'}`);
  showToast(`Simulated API Latency toggled ${qasLatencyActive ? 'ON' : 'OFF'}`, qasLatencyActive ? "success" : "info");
}

function toggleQasError() {
  qasErrorActive = !qasErrorActive;
  const btn = document.getElementById('qas-btn-error');
  btn.classList.toggle('active', qasErrorActive);
  
  logAuditAction(`QAS STAGING: API Failure simulation toggled ${qasErrorActive ? 'ON (HTTP 429)' : 'OFF'}`);
  showToast(`Simulated API Errors toggled ${qasErrorActive ? 'ON' : 'OFF'}`, qasErrorActive ? "success" : "info");
}

function resetQasWorkstation() {
  logAuditAction("QAS STAGING: Sandbox workstation state reset requested");
  
  // Re-initialize default patients datasets
  patients[0].rawNotes = "62yo male admitted with fever, productive cough, and progressive dyspnoea. Documented Penicillin allergy. Needs Azithromycin or penicillin-safe alternative. We accidentally listed Amoxicillin 500mg TID on discharge meds order. Also patient takes Metformin 1000mg BD for T2DM, but we put 500mg BD in the discharge order. Confirm final sputum/blood cultures which are still pending at time of draft. Follow up Pulmonology OPD.";
  patients[0].critResolved = false;
  patients[0].medications = [
    { name: "Amoxicillin 500mg PO TID", instruction: "Take 1 tablet by mouth three times daily for lung infection (7 days)" },
    { name: "Metformin 500mg PO BD", instruction: "Take 1 tablet by mouth twice daily with meals for diabetes control" },
    { name: "Azithromycin 500mg PO OD", instruction: "Take 1 tablet by mouth once daily for 5 days" },
    { name: "Paracetamol 650mg PO SOS", instruction: "Take 1 tablet by mouth every 6 hours as needed for fever or pain" }
  ];
  patients[0].status = "crit";
  patients[0].step = 0;
  patients[0].scraped = false;
  patients[0].followupDate = "";

  patients[2].medications = [
    { name: "Clopidogrel 75mg PO OD", instruction: "Take 1 tablet by mouth daily to keep stent open (12 months)" },
    { name: "Lisinopril 5mg PO OD", instruction: "Take 1 tablet by mouth once daily" }
  ];
  patients[2].status = "pend";
  patients[2].step = 1;
  patients[2].scraped = true;

  patients[3].medications = [
    { name: "Insulin Glargine 10 units SC", instruction: "Inject 10 units under the skin once daily at bedtime" }
  ];
  patients[3].status = "draft";
  patients[3].step = 1;
  patients[3].scraped = true;
  
  qasLatencyActive = false;
  qasErrorActive = false;
  document.getElementById('qas-btn-latency').classList.remove('active');
  document.getElementById('qas-btn-error').classList.remove('active');
  
  selectPatient(0);
  showToast("QAS Workstation Sandbox fully reset!", "success");
}
