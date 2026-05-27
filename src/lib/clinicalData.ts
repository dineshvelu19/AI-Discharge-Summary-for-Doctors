import { Patient } from '@/types/clinical';

export const INITIAL_PATIENTS: Patient[] = [
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
        why: "You were admitted because of a lung infection called pneumonia. This caused your high fever, productive cough, and breathing difficulty.",
        treatments: "You received oxygen support, intravenous antibiotics, and fever reducers. Your lungs have recovered nicely and you are ready for home discharge.",
        restrictions: "Avoid strenuous work. Drink plenty of water and maintain a high-protein diet.",
        warnings: "Return to emergency if: fever returns over 38.5°C, breathing becomes rapid/difficult, or chest pain occurs.",
        followup: "Follow up at the Pulmonology Clinic. Date pending physician entry."
      },
      ta: {
        why: "நுரையீரலில் ஏற்பட்ட நிமோனியா என்ற கிருமித்தொற்று காரணமாக நீங்கள் அனுமதிக்கப்பட்டீர்கள். இதனால் காய்ச்சல், இருமல் மற்றும் மூச்சுத்திணறல் ஏற்பட்டது.",
        treatments: "உங்களுக்கு ஆக்சிஜன் ஆதரவு, நரம்பு வழி ஆன்டிபயாடிக்குகள் மற்றும் காய்ச்சல் மருந்துகள் வழங்கப்பட்டன. நுரையீரல் நன்றாக குணமாகிவிட்டது.",
        restrictions: "கடினமான வேலைகளைத் தவிர்க்கவும். நிறைய தண்ணீர் குடிக்கவும், சத்தான உணவை உட்கொள்ளவும்.",
        warnings: "காய்ச்சல் 38.5°Cக்கு மேல் திரும்பினால், மூச்சுத்திணறல் ஏற்பட்டால், அல்லது நெஞ்சு வலி வந்தால் உடனே அவசர சிகிச்சைக்கு வரவும்.",
        followup: "நுரையீரல் மருத்துவமனைக்கு வரவும். தேதி இன்னும் முடிவு செய்யப்படவில்லை."
      },
      hi: {
        why: "आपको फेफड़ों के संक्रमण, जिसे निमोनिया कहते हैं, के कारण भर्ती किया गया था। इससे आपको तेज बुखार, खांसी और सांस लेने में कठिनाई हो रही थी।",
        treatments: "आपको ऑक्सीजन, नसों द्वारा एंटीबायोटिक्स और बुखार की दवाएं दी गईं। आपके फेफड़े अब काफी ठीक हैं और आप घर जा सकते.",
        restrictions: "कठिन परिश्रम से बचें। पर्याप्त पानी पीएं और प्रोटीन युक्त आहार लें।",
        warnings: "यदि बुखार फिर से 38.5°C से ऊपर जाए, सांस लेने में तकलीफ हो, या सीने में दर्द हो, तो तुरंत आपातकालीन विभाग में आएं।",
        followup: "पल्मोनोलॉजी क्लिनिक में फॉलो-अप करें। तिथि डॉक्टर द्वारा भरी जानी है।"
      },
      kn: {
        why: "ಶ್ವಾಸಕೋಶದ ಸೋಂಕಾದ ನ್ಯುಮೋನಿಯಾದಿಂದಾಗಿ ನಿಮ್ಮನ್ನು ದಾಖಲಿಸಲಾಗಿತ್ತು. ಇದು ತೀವ್ರ ಜ್ವರ, ಕೆಮ್ಮು ಮತ್ತು ಉಸಿರಾಟದ ತೊಂದರೆಯನ್ನು ಉಂಟುಮಾಡಿತ್ತು.",
        treatments: "ನಿಮಗೆ ಆಮ್ಲಜನಕದ ಬೆಂಬಲ, ರಕ್ತನಾಳದ ಮೂಲಕ ಪ್ರತಿಜೀವಕಗಳು ಮತ್ತು ಜ್ವರ ನಿವಾರಕಗಳನ್ನು ನೀಡಲಾಗಿತ್ತು. ನಿಮ್ಮ ಶ್ವಾಸಕೋಶವು ಈಗ ಚೇತರಿಸಿಕೊಂಡಿದೆ.",
        restrictions: "ಕಷ್ಟದ ಕೆಲಸಗಳನ್ನು ಮಾಡಬೇಡಿ. ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ಪ್ರೋಟೀನ್ ಭರಿತ ಆಹಾರವನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
        warnings: "ಜ್ವರ 38.5°C ಗಿಂತ ಹೆಚ್ಚಾದರೆ, ಉಸಿರಾಟದ ತೊಂದರೆ ಮರುಕಳಿಸಿದರೆ, ಅಥವಾ ಎದೆನೋವು ಬಂದರೆ ತಕ್ಷಣವೇ ತುರ್ತು ಚಿಕಿತ್ಸೆಗೆ ಬನ್ನಿ.",
        followup: "ಶ್ವಾಸಕೋಶದ ವಿಭಾಗಕ್ಕೆ ಭೇಟಿ ನೀಡಿ. ದಿನಾಂಕ ವೈದ್ಯರು ನಮೂದಿಸಬೇಕು."
      },
      es: {
        why: "Fue ingresado por una infección pulmonar llamada neumonía. Esto le causó fiebre alta, tos productiva y dificultad para respirar.",
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
        why: "You were admitted due to an inflamed and swollen appendix, known as acute appendicitis.",
        treatments: "Our surgeons performed a laparoscopic appendectomy, which means your appendix was successfully removed through small cuts while you were asleep.",
        restrictions: "Do not lift anything heavier than 10 pounds for 2 weeks. Avoid strenuous sports.",
        warnings: "Go to emergency if: you develop fever over 101°F, worsening stomach pain, or persistent vomiting.",
        followup: "Follow-up checkup scheduled at the Surgical OPD in 14 days."
      },
      ta: {
        why: "உங்கள் அடிவயிற்றில் ஏற்பட்ட கிருமித்தொற்று காரணமாக நீங்கள் அனுமதிக்கப்பட்டீர்கள் (அபென்டிசிடிஸ்).",
        treatments: "அறுவைசிகிச்சை மூலம் உங்கள் அபென்டிக்ஸ் வெற்றிகரமாக அகற்றப்பட்டது. சிறிய தையல்கள் போடப்பட்டுள்ளன.",
        restrictions: "2 வாரங்களுக்கு 5 கிலோவுக்கு மேல் எடையுள்ள பொருட்களைத் தூக்க வேண்டாம். ஓய்வு எடுக்கவும்.",
        warnings: "காயச்சல் வந்தால், அடிவயிறு கடுமையாக வலித்தால், அல்லது வாந்தி எடுத்தால் உடனே மருத்துவமனைக்கு வரவும்.",
        followup: "அறுவைசிகிச்சை பிரிவில் 14 நாட்களில் மீண்டும் வந்து காண்பிக்கவும்."
      },
      hi: {
        why: "आपको अपेंडिक्स में सूजन के कारण भर्ती किया गया था, जिसे एक्यूट अपेंडिसाइटिस कहते हैं।",
        treatments: "दूरबीन विधि (लेप्रोस्कोपिक) द्वारा आपका अपेंडिक्स सुरक्षित रूप से बाहर निकाल दिया गया है। घाव ठीक हो रहे हैं.",
        restrictions: "2 सप्ताह तक भारी वजन (5 किलो से अधिक) न उठाएं। हल्का टहलें।",
        warnings: "यदि तेज बुखार हो, पेट में असहनीय दर्द हो, या लगातार उल्टी हो, तो तुरंत डॉक्टर को दिखाएं।",
        followup: "14 दिनों में सर्जिकल ओपीडी में डॉक्टर से मिलें।"
      },
      kn: {
        why: "ಅಪೆಂಡಿಕ್ಸ್‌ನ ತೀವ್ರ ಊತದಿಂದಾಗಿ ನಿಮ್ಮನ್ನು ದಾಖಲಿಸಲಾಗಿತ್ತು (ಅಕ್ಯೂಟ್ ಅಪೆಂಡಿಸೈಟಿಸ್).",
        treatments: "ಲ್ಯಾಪರೊಸ್ಕೋಪಿಕ್ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಯ ಮೂಲಕ ನಿಮ್ಮ ಅಪೆಂಡಿಕ್ಸ್ ಅನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಹೊರತೆಗೆಯಲಾಗಿದೆ.",
        restrictions: "2 ವಾರಗಳವರೆಗೆ ಯಾವುದೇ ಭಾರೀ ತೂಕವನ್ನು ಎತ್ತಬೇಡಿ. ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.",
        warnings: "ಜ್ವರ ಬಂದರೆ, ಹೊಟ್ಟೆನೋವು ಹೆಚ್ಚಾದರೆ, ಅಥವಾ ವಾಂತಿ ತಡೆಯದಿದ್ದರೆ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಬನ್ನಿ.",
        followup: "14 ದಿನಗಳ ನಂತರ ಶಸ್ತ್ರಚಿಕಿತ್ಸಾ ವಿಭಾಗಕ್ಕೆ ಬಂದು ಪರೀಕ್ಷಿಸಿಕೊಳ್ಳಿ."
      },
      es: {
        why: "Fue ingresada por una inflamación de su apéndice, conocida como apendicitis aguda.",
        treatments: "Realizamos una apendicectomía laparoscópica, extirpando su apéndice a través de pequeños cortes mientras dormía.",
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
        why: "You were admitted due to a heart attack (acute block in your heart's main artery).",
        treatments: "We opened the blocked artery in the cardiac catheter lab and placed a drug-eluting metal stent to keep blood flowing safely.",
        restrictions: "Do not lift over 10 pounds. Avoid strenuous activity and heavy exercise for 4 weeks.",
        warnings: "Call emergency immediately if chest pain/pressure returns, or if you feel severe breathlessness or sweating.",
        followup: "Follow-up scheduled at the Cardiology OPD. Date pending."
      },
      ta: {
        why: "உங்களுக்கு ஏற்பட்ட மாரடைப்பு (இதய இரத்தக் குழாயில் அடைப்பு) காரணமாக நீங்கள் அனுமதிக்கப்பட்டீர்கள்.",
        treatments: "ஆஞ்சியோபிளாஸ்டி மூலம் உங்கள் இதய அடைப்பு நீக்கப்பட்டு, ஒரு ஸ்டென்ட் பொருத்தப்பட்டது.",
        restrictions: "4 வாரங்களுக்குப் பாரமான பொருட்கள் தூக்கக் கூடாது. உடற்பயிற்சிகளைத் தவிர்க்கவும்.",
        warnings: "நெஞ்சு வலி திரும்பினாலோ, மூச்சுத்திணறல் வந்தாலோ உடனே அவசர சிகிச்சையைத் தொடர்புகொள்ளவும்.",
        followup: "இதய சிகிச்சை பிரிவில் அடுத்த வாரம் வந்து காண்பிக்கவும்."
      },
      hi: {
        why: "आपको दिल का दौरा (हृदय की मुख्य धमनी में रुकावट) पड़ने के कारण भर्ती किया गया था।",
        treatments: "कैथ लैब में आपकी अवरुद्ध धमनी को खोला गया और रक्त प्रवाह सुचारू रखने के लिए एक स्टेंट लगाया गया है।",
        restrictions: "4 सप्ताह तक भारी काम या व्यायाम न करें। हृदय-अनुकूल भोजन लें।",
        warnings: "यदि सीने में दर्द लौटे, सांस फूलने लगे या पसीना आए, तो तुरंत आपातकालीन सहायता लें।",
        followup: "कार्डियोलॉजी विभाग में अगले सप्ताह फॉलो-अप करें।"
      },
      kn: {
        why: "ನಿಮಗೆ ಹೃದಯಾಘಾತವಾಗಿದ್ದರಿಂದ (ಹೃದಯದ ಪ್ರಮುಖ ರಕ್ತನಾಳ ಬಂದ್ ಆಗಿದ್ದರಿಂದ) ದಾಖಲಿಸಲಾಗಿತ್ತು.",
        treatments: "ಕ್ಯಾಥ್ ಲ್ಯಾಬ್‌ನಲ್ಲಿ ನಿಮ್ಮ ರಕ್ತನಾಳದ ಬ್ಲಾಕ್ ತೆಗೆದು ರಕ್ತ ಪರಿಚಲನೆಗೆ ಒಂದು ಸ್ಟೆಂಟ್ ಹಾಕಲಾಗಿದೆ.",
        restrictions: "4 ವಾರಗಳವರೆಗೆ ಯಾವುದೇ ಭಾರೀ ಕೆಲಸ ಅಥವಾ ವ್ಯಾಯಾಮ ಮಾಡಬೇಡಿ.",
        warnings: "ಎದೆನೋವು ಮರುಕಳಿಸಿದರೆ ಅಥವಾ ತೀವ್ರ ಉಸಿರಾಟದ ತೊಂದರೆಯಾದರೆ ತಕ್ಷಣ ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ.",
        followup: "ಹೃದ್ರೋಗ ವಿಭಾಗದಲ್ಲಿ ಮುಂದಿನ ವಾರ ತಪಾಸಣೆ ಮಾಡಿಸಿಕೊಳ್ಳಿ."
      },
      es: {
        why: "Fue ingresado debido a un ataque cardíaco (bloqueo agudo en la arteria principal del corazón).",
        treatments: "Abrimos la arteria bloqueada en el laboratorio de cateterismo e implantamos un stent metálico para mantener el flujo sanguíneo.",
        restrictions: "No cargue más de 10 libras. Evite el esfuerzo físico y el ejercicio por 4 semanas.",
        warnings: "Llame a urgencias de inmediato si regresa el dolor de pecho, o si siente falta de aire o sudoración.",
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
        why: "You were admitted for a serious diabetes complication called Diabetic Ketoacidosis (DKA), caused by very high sugar and low insulin.",
        treatments: "We gave you saline fluids and continuous IV insulin to lower your blood sugar and clear the acids from your body. You are now transitioned to home insulin shots.",
        restrictions: "Test your blood sugar 4 times daily (before meals and at bed). Coordinate meals with insulin.",
        warnings: "Seek emergency care if you feel nauseous/vomit, have rapid breathing, or blood sugar goes over 250 mg/dL.",
        followup: "Follow up closely with the Endocrinology Clinic in 3 days."
      },
      ta: {
        why: "நீரிழிவு நோயின் கடுமையான பாதிப்பான நீரிழிவு கீட்டோஅசிடோசிஸ் (DKA) காரணமாக நீங்கள் அனுமதிக்கப்பட்டீர்கள்.",
        treatments: "ஊசி மூலம் நரம்பு வழி திரவங்கள் மற்றும் இன்சுலின் வழங்கப்பட்டு இரத்தச் சர்க்கரை மற்றும் அமில அளவு கட்டுப்படுத்தப்பட்டது.",
        restrictions: "தினமும் 4 முறை இரத்தச் சர்க்கரையைச் சோதிக்கவும். இன்சுலின் அளவோடு உணவைச் சரியாக உண்ணவும்.",
        warnings: "வாந்தி எடுத்தாலோ, மூச்சு விரைவாக வாங்கினாலோ, அல்லது சர்க்கரை அளவு 250க்கு மேல் இருந்தால் உடனே அவசர சிகிச்சைக்கு வரவும்.",
        followup: "எண்டோகிரைனாலஜி பிரிவில் 3 நாட்களில் காண்பிக்கவும்."
      },
      hi: {
        why: "आपको मधुमेह की एक गंभीर जटिलता, डायबिटिक कीटोएसिडोसिस (DKA) के कारण भर्ती किया गया था, जिसमें रक्त में एसिड बढ़ जाता है।",
        treatments: "हमने आपको ग्लूकोज नियंत्रित करने और एसिड साफ करने के लिए नसों द्वारा इंसुलिन और तरल पदार्थ दिए। अब आप घर के इंसुलिन पर हैं।",
        restrictions: "दिन में 4 बार शुगर की जांच करें। इंसुलिन खुराक के साथ भोजन का समन्वय करें।",
        warnings: "यदि उल्टी हो, सांस लेने में तेजी आए, या शुगर स्तर लगातार 250 से ऊपर रहे, तो तुरंत आपातकालीन सहायता लें.",
        followup: "3 दिनों के भीतर एंडोक्राइनोलॉजी क्लिनिक में फॉलो-अप करें।"
      },
      kn: {
        why: "ಮಧುಮೇಹದ ತೀವ್ರ ತೊಂದರೆಯಾದ ಡಯಾಬಿಟಿಕ್ ಕೀಟೋಅಸಿಡೋಸಿಸ್ (DKA) ಸೋಂಕಿನಿಂದ ನಿಮ್ಮನ್ನು ದಾಖಲಿಸಲಾಗಿತ್ತು.",
        treatments: "ನಿಮ್ಮ ರಕ್ತದ ಸಕ್ಕರೆಯನ್ನು ನಿಯಂತ್ರಿಸಲು ಮತ್ತು ಆಮ್ಲಗಳನ್ನು ತೆರವುಗೊಳಿಸಲು ರಕ್ತನಾಳದ ಮೂಲಕ ದ್ರವ ಮತ್ತು ಇನ್ಸುಲಿನ್ ನೀಡಲಾಗಿತ್ತು.",
        restrictions: "ದಿನಕ್ಕೆ 4 ಬಾರಿ ರಕ್ತದ ಸಕ್ಕರೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ. ಇನ್ಸುಲಿನ್ ಪಡೆದ ನಂತರ ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಊಟ ಮಾಡಿ.",
        warnings: "ವಾಂತಿ ಉಂಟಾದರೆ, ತೀವ್ರ ಉಸಿರಾಟದ ತೊಂದರೆಯಾದರೆ, ಅಥವಾ ಸಕ್ಕರೆ 250ಕ್ಕಿಂತ ಹೆಚ್ಚಿದ್ದರೆ ತಕ್ಷಣ ತುರ್ತು ಚಿಕಿತ್ಸೆಗೆ ಬನ್ನಿ.",
        followup: "3 ದಿನಗಳಲ್ಲಿ ಎಂಡೋಕ್ರೈನಾಲಜಿ ವಿಭಾಗದಲ್ಲಿ ತಪಾಸಣೆ ಮಾಡಿಸಿಕೊಳ್ಳಿ."
      },
      es: {
        why: "Fue ingresada por una complicación grave de la diabetes llamada cetoacidosis diabética (CAD), por falta de insulina y azúcar muy alta.",
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
