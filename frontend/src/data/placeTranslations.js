const placeTranslations = {
  en: {
    ward: 'Ward',
    hyderabad: 'Hyderabad',
    telangana: 'Telangana',
    'rajendra nagar': 'Rajendra Nagar',
    'ranga reddy': 'Ranga Reddy',
    'medchal-malkajgiri': 'Medchal-Malkajgiri',
    nagole: 'Nagole',
    attapur: 'Attapur'
  },
  te: {
    ward: 'వార్డు',
    hyderabad: 'హైదరాబాద్',
    telangana: 'తెలంగాణ',
    'rajendra nagar': 'రాజేంద్ర నగర్',
    'ranga reddy': 'రంగారెడ్డి',
    'medchal-malkajgiri': 'మెద్చల్-మల్కాజిగిరి',
    nagole: 'నాగోల్',
    attapur: 'అట్టాపూర్'
  },
  hi: {
    ward: 'वार्ड',
    hyderabad: 'हैदराबाद',
    telangana: 'तेलंगाना',
    'rajendra nagar': 'राजेंद्र नगर',
    'ranga reddy': 'रंगारेड्डी',
    'medchal-malkajgiri': 'मेडचल-मलकाजगिरी',
    nagole: 'नागोल',
    attapur: 'अट्टापुर'
  },
  ta: {
    ward: 'வார்டு',
    hyderabad: 'ஹைதராபாத்து',
    telangana: 'தெலங்கானா',
    'rajendra nagar': 'ராஜேந்திர நகர்',
    'ranga reddy': 'ரங்கா ரெட்டி',
    'medchal-malkajgiri': 'மேட்சல்-மல்காஜ்கிரி',
    nagole: 'நாகோல்',
    attapur: 'அட்டாபூர்'
  },
  kn: {
    ward: 'ವಾರ್ಡ್',
    hyderabad: 'ಹೈದರಾಬಾದ್',
    telangana: 'ತೆಲಂಗಾಣ',
    'rajendra nagar': 'ರಾಜೇಂದ್ರ ನಗರ',
    'ranga reddy': 'ರಂಗಾ ರೆಡ್ಡಿ',
    'medchal-malkajgiri': 'ಮೇಡಚಲ್-ಮಲ್ಕಾಜ್ಗಿರಿ',
    nagole: 'ನಾಗೋಲ್',
    attapur: 'ಅಟ್ಟಾಪುರ'
  },
  ml: {
    ward: 'വാർഡ്',
    hyderabad: 'ഹൈദരാബാദ്',
    telangana: 'തെലങ്കാന',
    'rajendra nagar': 'രാജേന്ദ്ര നഗർ',
    'ranga reddy': 'രംഗ റെഡ്ഡി',
    'medchal-malkajgiri': 'മെഡ്ചൽ-മൽകാജ്ഗിരി',
    nagole: 'നാഗോൾ',
    attapur: 'അട്ടാപൂർ'
  },
  mr: {
    ward: 'वॉर्ड',
    hyderabad: 'हैदराबाद',
    telangana: 'तेलंगणा',
    'rajendra nagar': 'राजेंद्र नगर',
    'ranga reddy': 'रंगारेड्डी',
    'medchal-malkajgiri': 'मेडचल-मलकाजगिरी',
    nagole: 'नागोल',
    attapur: 'अट्टापुर'
  },
  gu: {
    ward: 'વોર્ડ',
    hyderabad: 'હૈદરાબાદ',
    telangana: 'તેલંગાણા',
    'rajendra nagar': 'રાજેન્દ્ર નગર',
    'ranga reddy': 'રંગા રેડ્ડી',
    'medchal-malkajgiri': 'મેડચલ-મલ્કાજગિરી',
    nagole: 'નાગોલ',
    attapur: 'અટ્ટાપુર'
  },
  pa: {
    ward: 'ਵਾਰਡ',
    hyderabad: 'ਹੈਦਰਾਬਾਦ',
    telangana: 'ਤੇਲੰਗਾਨਾ',
    'rajendra nagar': 'ਰਾਜੇਂਦਰ ਨਗਰ',
    'ranga reddy': 'ਰੰਗਾ ਰੈੱਡੀ',
    'medchal-malkajgiri': 'ਮੈਡਚਲ-ਮਲਕਾਜਗਿਰੀ',
    nagole: 'ਨਾਗੋਲ',
    attapur: 'ਅੱਟਾਪੁਰ'
  },
  bn: {
    ward: 'ওয়ার্ড',
    hyderabad: 'হায়দরাবাদ',
    telangana: 'তেলেঙ্গানা',
    'rajendra nagar': 'রাজেন্দ্র নগর',
    'ranga reddy': 'রঙ্গা রেড্ডি',
    'medchal-malkajgiri': 'মেডচল-মালকাজগিরি',
    nagole: 'নাগোল',
    attapur: 'আট্টাপুর'
  },
  or: {
    ward: 'ୱାର୍ଡ',
    hyderabad: 'ହାଇଦ୍ରାବାଦ',
    telangana: 'ତେଲଙ୍ଗାନା',
    'rajendra nagar': 'ରାଜେନ୍ଦ୍ର ନଗର',
    'ranga reddy': 'ରଙ୍ଗା ରେଡ୍ଡି',
    'medchal-malkajgiri': 'ମେଡଚାଲ-ମଲ୍କାଜଗିରି',
    nagole: 'ନାଗୋଲ',
    attapur: 'ଆଟ୍ଟାପୁର'
  },
  as: {
    ward: 'ৱাৰ্ড',
    hyderabad: 'হাইদৰাবাদ',
    telangana: 'তেলাংগানা',
    'rajendra nagar': 'রাজেন্দ্ৰ নগৰ',
    'ranga reddy': 'ৰংগা ৰেড্ডি',
    'medchal-malkajgiri': 'মেডচেল-মলকাজগিৰি',
    nagole: 'নাগোল',
    attapur: 'আট্টাপুৰ'
  },
  ur: {
    ward: 'وارڈ',
    hyderabad: 'حیدرآباد',
    telangana: 'تلنگانہ',
    'rajendra nagar': 'راجندر نگر',
    'ranga reddy': 'رنگا ریڈی',
    'medchal-malkajgiri': 'میڈچل-ملکاجگیری',
    nagole: 'ناگول',
    attapur: 'اٹاپور'
  }
};

export default placeTranslations;

