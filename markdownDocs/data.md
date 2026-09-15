# Data Reference
## MPLADS AI Watchdog — Real Data Supplied by User

**Companion documents:** `prd.md` (product scope), `trd.md` (architecture, stack, schema)

This document holds the **real data** supplied for the prototype. Per the PRD's data approach: real data listed here is used wherever it applies; any module or field not covered here is filled with fake/sample data that follows the same structure.

---

## 1. MP Fund Allocation Data (Real)

**Source:** "Allocated Limit for Hon'ble MPs" — official MPLADS allocation list, provided as a PDF (543 MPs).

**Conversion applied:** the source PDF lists amounts in plain ₹ (rupees). All figures below have been converted to **₹ Crore** (1 Crore = ₹1,00,00,000) for display consistency with the rest of the platform, which expresses fund figures in Crore throughout (per the PRD's KPI/dashboard conventions). Values are rounded to 2 decimal places.

**Validation:** the sum of all 543 converted figures reconciles exactly with the PDF's stated grand total of ₹8,335.21 Crore (₹83,35,20,84,246.34) — confirming no rows were dropped or misread during extraction.

**One known data gap in the source:** Sr. No. 108 (CHAVAN VASANTRAO BALWANTRAO, NANDED, Maharashtra) has no allocated amount listed in the original PDF — this appears to be a gap in the source document itself, not an extraction error. It is marked "Not available in source" below; treat it as a candidate for fake-data fill if this MP's record needs a complete amount for a demo.

**Product requirement (per user instruction):** on the website, wherever "Allocated Limit for Hon'ble MPs" is opened/clicked, this dataset must be presented as a **list** (not a chart or summary) — i.e., a browsable/searchable list of all MPs with their state, constituency, and allocated amount, matching the structure below.

| Sr. No. | State | Hon'ble Member of Parliament | Constituency | Allocated Amount (₹ Crore) |
|---|---|---|---|---|
| 1 | Maharashtra | AASHTIKAR PATIL NAGESH BAPURAO | HINGOLI | 19.03 |
| 2 | Jammu And Kashmir | ABDUL RASHID SHEIKH | BARAMULLAH | 15.48 |
| 3 | Bihar | ABHAY KUMAR SINHA | AURANGABAD_BR | 14.70 |
| 4 | West Bengal | ABHIJIT GANGOPADHYAY | TAMLUK | 14.70 |
| 5 | West Bengal | Abu Taher Khan | MURSHIDABAD | 14.70 |
| 6 | West Bengal | ADHIKARI SOUMENDU | KANTHI | 14.70 |
| 7 | Uttar Pradesh | ADITYA YADAV | BADAUN | 14.70 |
| 8 | Kerala | Adv Adoor Prakash | ATTINGAL | 14.70 |
| 9 | Kerala | Adv Dean Kuriakose | IDUKKI | 14.70 |
| 10 | Maharashtra | ADV GOWAAL KAGADA PADAVI | NANDURBAR(ST) | 14.78 |
| 11 | Kerala | ADV K FRANCIS GEORGE | KOTTAYAM | 18.87 |
| 12 | Uttar Pradesh | AFZAL ANSARI | GHAZIPUR | 22.05 |
| 13 | Jammu And Kashmir | AGA SYED RUHULLAH MEHDI | SRINAGAR | 14.70 |
| 14 | Uttarakhand | Ajay Bhatt | NAINITAL UDHAM SINGH NAG. | 14.70 |
| 15 | Bihar | Ajay Kumar Mandal | BHAGALPUR | 14.70 |
| 16 | Uttarakhand | Ajay Tamta | ALMORA(SC) | 14.70 |
| 17 | Uttar Pradesh | AJENDRA SINGH LODHI | HAMIRPUR_UP | 14.70 |
| 18 | Uttar Pradesh | AKHILESH YADAV | KANNAUJ | 14.70 |
| 19 | Uttar Pradesh | AKSHAYA YADAV | FIROZABAD | 14.70 |
| 20 | Manipur | ALFRED KANNGAM S ARTHUR | OUTER MANIPUR(ST) | 14.70 |
| 21 | Bihar | Alok Kumar Suman | GOPALGANJ (SC) | 14.70 |
| 22 | Madhya Pradesh | ALOK SHARMA | BHOPAL | 14.70 |
| 23 | Maharashtra | AMAR SHARADRAO KALE | WARDHA | 14.70 |
| 24 | Assam | AMARSING TISSO | Diphu (ST) | 14.70 |
| 25 | Andhra Pradesh | AMBICA G LAKSHMINARAYANA VALMIKI | ANANTAPUR | 20.19 |
| 26 | Maharashtra | Amol Ramsing Kolhe | SHIRUR | 14.70 |
| 27 | Rajasthan | AMRARAM | SIKAR | 16.57 |
| 28 | Punjab | AMRINDER SINGH RAJA WARRING | LUDHIANA | 14.70 |
| 29 | Uttar Pradesh | ANAND BHADAURIYA | DHAURAHRA | 14.70 |
| 30 | Uttar Pradesh | ANAND KUMAR | BAHRAICH(SC) | 14.70 |
| 31 | Odisha | ANANTA NAYAK | KEONJHAR(ST) | 14.70 |
| 32 | Tamil Nadu | Andimuthu Raja | NILGIRIS(SC) | 14.70 |
| 33 | Meghalaya | ANDREW J. SYNGKON | SHILLONG | 9.80 |
| 34 | Manipur | ANGOMCHA BIMOL AKOIJAM | INNER MANIPUR | 14.70 |
| 35 | Uttarakhand | ANIL BALUNI | GARHWAL | 14.70 |
| 36 | Maharashtra | ANIL YESHWANT DESAI | MUMBAI SOUTH CENTRAL | 14.70 |
| 37 | Madhya Pradesh | ANITA NAGARSINGH CHOUHAN | RATLAM(ST) | 14.70 |
| 38 | Odisha | ANITA SUBHADARSHINI | ASKA | 14.70 |
| 39 | Jharkhand | Annpurna Devi | KODARMA | 16.67 |
| 40 | Uttar Pradesh | ANOOP PRADHAN BALMIKI | HATHRAS (SC) | 14.70 |
| 41 | Kerala | Anto Antony | PATHANAMTHITTA | 14.70 |
| 42 | Maharashtra | ANUP SANJAY DHOTRE | AKOLA | 14.70 |
| 43 | Uttar Pradesh | Anurag Sharma | JHANSI | 14.70 |
| 44 | Himachal Pradesh | Anurag Singh Thakur | HAMIRPUR_HP | 14.96 |
| 45 | Andhra Pradesh | Appalanaidu Kalisetti | VIZIANAGARAM | 14.70 |
| 46 | Bihar | ARUN BHARTI | JAMUI(SC) | 19.49 |
| 47 | Uttar Pradesh | ARUN GOVIL | MEERUT | 14.70 |
| 48 | Tamil Nadu | ARUN NEHRU | PERAMBALUR | 14.70 |
| 49 | Telangana | ARUNA. D. K | MAHABUBNAGAR | 14.70 |
| 50 | West Bengal | ARUP CHAKRABORTY | BANKURA | 14.70 |
| 51 | Telangana | Arvind Dharmapuri | NIZAMABAD | 28.14 |
| 52 | Maharashtra | Arvind Ganpat Sawant | MUMBAI SOUTH | 14.70 |
| 53 | Telangana | Asaduddin Owaisi | HYDERABAD | 14.70 |
| 54 | Madhya Pradesh | ASHISH DUBEY | JABALPUR | 14.70 |
| 55 | Uttar Pradesh | Ashok Kumar Rawat | MISRIKH(SC) | 14.70 |
| 56 | Bihar | Ashok Kumar Yadav | MADHUBANI | 14.70 |
| 57 | West Bengal | Asit Kumar Mal | BOLPUR(SC) | 27.57 |
| 58 | Uttar Pradesh | ATUL GARG | GHAZIABAD | 15.53 |
| 59 | Odisha | AVIMANYU SETHI | BHADRAK(SC) | 14.70 |
| 60 | Uttar Pradesh | AWADHESH PRASAD | FAIZABAD | 14.70 |
| 61 | West Bengal | AZAD KIRTI JHA | BARDHAMAN-DURGAPUR | 17.97 |
| 62 | Andhra Pradesh | B K PARTHASARATHI | HINDUPUR | 16.05 |
| 63 | Uttar Pradesh | BABU SINGH KUSHWAHA | JAUNPUR | 14.70 |
| 64 | Maharashtra | BACHHAV SHOBHA DINESH | DHULE | 14.70 |
| 65 | West Bengal | BAG MITALI | ARAMBAG(SC) | 14.70 |
| 66 | Odisha | BAIJAYANT PANDA | KENDRAPARA | 14.70 |
| 67 | Maharashtra | BAJRANG MANOHAR SONWANE | BEED | 16.59 |
| 68 | Odisha | BALABHADRA MAJHI | NABARANGPUR(ST) | 14.74 |
| 69 | Andhra Pradesh | Balashowry Vallabbhaneni | MACHILIPATNAM | 14.70 |
| 70 | Telangana | BALRAM NAIK PORIKA | MAHABUBABAD | 14.70 |
| 71 | Maharashtra | BALWANT BASWANT WANKHADE | AMRAVATI(SC) | 19.83 |
| 72 | Maharashtra | BALYA MAMA SURESH GOPINATH MHATRE | BHIWANDI | 14.70 |
| 73 | Delhi | Bansuri Swaraj | NEW DELHI | 15.43 |
| 74 | West Bengal | BAPI HALDAR | MATHURAPUR(SC) | 14.70 |
| 75 | Karnataka | BASAVARAJ BOMMAI | HAVERI | 14.70 |
| 76 | Andhra Pradesh | BASTIPATI NAGARAJU PANCHALINGALA | KURNOOL | 16.00 |
| 77 | Rajasthan | Bhagirath Chaudhary | AJMER | 14.70 |
| 78 | Rajasthan | BHAJAN LAL JATAV | KARAULI-DHOLPUR(SC) | 14.70 |
| 79 | Madhya Pradesh | BHARAT SINGH KUSHWAH | GWALIOR | 15.15 |
| 80 | Gujarat | BHARATBHAI MANUBHAI SUTARIYA | AMRELI | 14.70 |
| 81 | Gujarat | Bharatsinhji Shankarji Dabhi | PATAN | 14.70 |
| 82 | Madhya Pradesh | BHARTI PARDHI | BALAGHAT | 15.44 |
| 83 | Maharashtra | BHASKAR MURLIDHAR BHAGARE | DINDORI(ST) | 14.70 |
| 84 | Maharashtra | BHAUSAHEB RAJARAM WAKCHAURE | SHIRDI(SC) | 14.70 |
| 85 | Chhattisgarh | BHOJRAJ NAG | KANKER(ST) | 16.47 |
| 86 | Uttar Pradesh | Bhola Singh | BULANDSHAHR(SC) | 14.70 |
| 87 | Maharashtra | BHUMARE SANDIPANRAO ASARAM | AURANGABAD_MH | 14.70 |
| 88 | Andhra Pradesh | Bhupathiraju Srinivasa varma | NARASAPURAM | 14.70 |
| 89 | Rajasthan | BHUPENDER YADAV | ALWAR | 14.70 |
| 90 | Odisha | BIBHU PRASAD TARAI | JAGATSINGHPUR(SC) | 14.70 |
| 91 | Jharkhand | Bidyut Baran Mahato | JAMSHEDPUR | 14.70 |
| 92 | Assam | BIJULI KALITA MEDHI | GUWAHATI | 14.70 |
| 93 | Tripura | BIPLAB KUMAR DEB | TRIPURA WEST | 14.70 |
| 94 | Andaman And Nicobar Islands | BISHNU PADA RAY | ANDAMAN AND NICOBAR ISLANDS | 14.70 |
| 95 | Rajasthan | BRIJENDRA SINGH OLA | JHUNJHUNU | 14.70 |
| 96 | Chhattisgarh | BRIJMOHAN AGRAWAL | RAIPUR | 15.38 |
| 97 | Madhya Pradesh | BUNTY VIVEK SAHU | CHHINDWARA | 14.70 |
| 98 | Gujarat | C R Patil | NAVSARI | 15.85 |
| 99 | Andhra Pradesh | C.M.RAMESH | ANAKAPALLE | 20.25 |
| 100 | Karnataka | CAPTAIN BRIJESH CHOWTA | DAKSHINA KANNADA | 14.70 |
| 101 | Goa | CAPTAIN VIRIATO FERNANDES | SOUTH GOA | 14.70 |
| 102 | Telangana | CHAMALA KIRAN KUMAR REDDY | BHONGIR | 14.70 |
| 103 | Uttar Pradesh | CHANDAN CHAUHAN | BIJNOR | 14.70 |
| 104 | Rajasthan | Chandra Prakash Joshi | CHITTORGARH | 14.70 |
| 105 | Uttar Pradesh | CHANDRA SHEKHAR | NAGINA(SC) | 14.70 |
| 106 | Gujarat | CHANDUBHAI CHHAGANBHAI SHIHORA | SURENDRANAGAR | 14.70 |
| 107 | Punjab | CHARANJIT SINGH CHANNI | JALANDHAR(SC) | 14.70 |
| 108 | Maharashtra | CHAVAN VASANTRAO BALWANTRAO | NANDED | Not available in source |
| 109 | Uttar Pradesh | CHHATRA PAL SINGH GANGWAR | BAREILLY | 14.70 |
| 110 | Maharashtra | CHHATRAPATI SHAHU SHAHAJI | KOLHAPUR | 14.70 |
| 111 | Uttar Pradesh | CHHOTELAL | ROBERTSGANJ(SC) | 14.70 |
| 112 | Chhattisgarh | CHINTAMANI MAHARAJ | SARGUJA(ST) | 14.70 |
| 113 | Bihar | CHIRAG PASWAN | HAJIPUR(SC) | 14.70 |
| 114 | Tamil Nadu | CN Annadurai | TIRUVANNAMALAI | 14.86 |
| 115 | Tamil Nadu | D M Kathir Anand | VELLORE | 16.02 |
| 116 | Tamil Nadu | D Ravikumar | VILUPPURAM(SC) | 19.76 |
| 117 | Andhra Pradesh | Daggubati Purandeshwari | RAJAHMUNDRY | 14.70 |
| 118 | Andhra Pradesh | DAGGUMALLA PRASADA RAO | CHITTOOR | 14.70 |
| 119 | Rajasthan | DAMODAR AGARWAL | BHILWARA | 14.70 |
| 120 | Uttar Pradesh | DAROGA PRASAD SAROJ | LALGANJ (SC) | 14.70 |
| 121 | Madhya Pradesh | DARSHAN SINGH CHOUDHARY | HOSHANGABAD | 14.70 |
| 122 | Haryana | DEEPENDER SINGH HOODA | ROHTAK | 14.70 |
| 123 | Uttar Pradesh | Devendra Alias Bhole Singh | AKBARPUR | 14.70 |
| 124 | Bihar | DEVESH CHANDRA THAKUR | SITAMARHI | 16.38 |
| 125 | Uttar Pradesh | DEVESH SHAKYA | ETAH | 14.70 |
| 126 | Gujarat | Devusinh Jesingbhai Chauhan | KHEDA | 14.70 |
| 127 | Maharashtra | Dhairyasheel Sambhajirao Mane | HATKANANGLE | 14.70 |
| 128 | Maharashtra | DHANORKAR PRATIBHA SURESH ALIAS BALUBHAU | CHANDRAPUR | 14.70 |
| 129 | Odisha | DHARMENDRA PRADHAN | SAMBALPUR | 14.70 |
| 130 | Uttar Pradesh | DHARMENDRA YADAV | AZAMGARH | 14.70 |
| 131 | Gujarat | DHAVAL LAXMANBHAI PATEL | VALSAD(ST) | 14.70 |
| 132 | Bihar | Dileshwar Kamait | SUPAUL | 15.05 |
| 133 | Assam | Dilip Saikia | Darrang-Udalguri | 14.70 |
| 134 | Bihar | Dinesh Chandra Yadav | MADHEPURA | 15.01 |
| 135 | Gujarat | DINESHBHAI MAKWANA | AHMEDABAD WEST(SC) | 16.04 |
| 136 | Andhra Pradesh | DR BYREDDY SHABARI | NANDYAL | 15.07 |
| 137 | Karnataka | DR C N MANJUNATH | BANGALORE RURAL | 14.70 |
| 138 | Andhra Pradesh | Dr Chandra Sekhar Pemmasani | GUNTUR | 15.98 |
| 139 | Punjab | DR DHARAMVIRA GANDHI | PATIALA | 14.70 |
| 140 | West Bengal | Dr Jayanta Kumar Roy | JALPAIGURI(SC) | 14.70 |
| 141 | Maharashtra | DR KALGE SHIVAJI BANDAPPA | LATUR(SC) | 14.70 |
| 142 | Bihar | Dr Mohammad Jawed | KISHANGANJ | 14.87 |
| 143 | Uttar Pradesh | DR RAJKUMAR SANGWAN | BAGHPAT | 14.70 |
| 144 | Tamil Nadu | DR RANI SRI KUMAR | TENKASI(SC) | 15.31 |
| 145 | Kerala | Dr Shashi Tharoor | THIRUVANANTHAPURAM | 14.70 |
| 146 | West Bengal | Dr Sukanta Majumdar | BALURGHAT | 15.71 |
| 147 | Gujarat | DR. HEMANG JOSHI | VADODARA | 14.70 |
| 148 | Maharashtra | DR. HEMANT VISHNU SAVARA | PALGHAR(ST) | 14.70 |
| 149 | Maharashtra | DR. KIRSAN NAMDEO | GADCHIROLI-CHIMUR(ST) | 14.70 |
| 150 | Madhya Pradesh | DR. LATA WANKHEDE | SAGAR | 14.70 |
| 151 | Kerala | DR. M.P ABDUSSAMAD SAMADANI | PONNANI | 17.04 |
| 152 | Gujarat | DR. MANSUKH MANDAVIYA | PORBANDAR | 14.70 |
| 153 | Karnataka | DR. PRABHA MALLIKARJUN | DAVANAGERE | 15.02 |
| 154 | Odisha | DR. PRADEEP KUMAR PANIGRAHY | BERHAMPUR | 14.70 |
| 155 | Maharashtra | DR. PRASHANT YADAORAO PADOLE | BHANDARA-GONDIYA | 15.97 |
| 156 | Punjab | DR. RAJ KUMAR CHABBEWAL | HOSHIARPUR(SC) | 14.70 |
| 157 | Madhya Pradesh | DR. RAJESH MISHRA | SIDHI | 26.27 |
| 158 | Uttar Pradesh | DR. S P SINGH | PRATAPGARH | 14.70 |
| 159 | West Bengal | DR. SHARMILA SARKAR | BARDHAMAN PURBA(SC) | 14.70 |
| 160 | Karnataka | DR.K.SUDHAKAR | CHIKBALLAPUR | 14.71 |
| 161 | Telangana | DR.MALLU RAVI | NAGARKURNOOL(SC) | 14.70 |
| 162 | Jharkhand | DULU MAHATO | DHANBAD | 14.70 |
| 163 | Tamil Nadu | DURAI VAIKO | TIRUCHIRAPPALLI | 14.70 |
| 164 | Madhya Pradesh | Durga Das Uikey | BETUL(ST) | 15.16 |
| 165 | Rajasthan | Dushyant Singh | JHALAWAR-BARAN | 14.70 |
| 166 | Karnataka | E. TUKARAM | BELLARY(ST) | 14.70 |
| 167 | Kerala | E.T. MOHAMMED BASHEER | MALAPPURAM | 16.39 |
| 168 | Telangana | EATALA RAJENDER | MALKAJGIRI | 32.75 |
| 169 | Tamil Nadu | ESWARASAMY K | POLLACHI | 16.23 |
| 170 | Madhya Pradesh | Faggan Singh Kulaste | MANDLA(ST) | 15.19 |
| 171 | Karnataka | G. KUMAR NAIK | RAICHUR(ST) | 14.70 |
| 172 | Maharashtra | GAIKWAD VARSHA EKNATH | MUMBAI NORTH-CENTRAL | 14.70 |
| 173 | Madhya Pradesh | Gajendra Singh Patel | KHARGONE(ST) | 14.70 |
| 174 | Rajasthan | Gajendra Singh Shekhawat | JODHPUR | 14.70 |
| 175 | Tamil Nadu | GANAPATHY RAJKUMAR P | COIMBATORE | 14.74 |
| 176 | Tamil Nadu | Ganesan Selvam | KANCHEEPURAM(SC) | 18.65 |
| 177 | Madhya Pradesh | Ganesh Singh | SATNA | 14.70 |
| 178 | Assam | GAURAV GOGOI | JORHAT | 14.70 |
| 179 | Gujarat | GENIBEN NAGAJI THAKOR | BANASKANTHA | 14.70 |
| 180 | Bihar | Giridhari Yadav | BANKA | 14.70 |
| 181 | Bihar | Giriraj Singh | BEGUSARAI | 14.70 |
| 182 | Andhra Pradesh | GM Harish Balayogi | AMALAPURAM(SC) | 14.70 |
| 183 | Telangana | GODAM NAGESH | ADILABAD(ST) | 14.70 |
| 184 | Tamil Nadu | GOPINATH K | KRISHNAGIRI | 14.70 |
| 185 | Karnataka | GOVIND MAKTHAPPA KARJOL | CHITRADURGA(SC) | 14.70 |
| 186 | Andhra Pradesh | Gumma Thanuja Rani | ARAKU(ST) | 14.95 |
| 187 | Punjab | GURMEET SINGH MEET HAYER | SANGRUR | 14.70 |
| 188 | Madhya Pradesh | Gyaneshwar Patil | KHANDWA | 15.57 |
| 189 | Karnataka | H.D. KUMARASWAMY | MANDYA | 14.70 |
| 190 | Uttar Pradesh | HARENDRA SINGH MALIK | MUZAFFARNAGAR | 14.70 |
| 191 | Gujarat | HARIBHAI PATEL | MAHESANA | 14.70 |
| 192 | Rajasthan | HARISH CHANDRA MEENA | TONK-SAWAI MADHOPUR | 14.70 |
| 193 | Delhi | Harsh Malhotra | EAST DELHI | 14.71 |
| 194 | Gujarat | Hasmukh Bhai Soma Bhai Patel | AHMEDABAD EAST | 14.70 |
| 195 | Uttar Pradesh | IMRAN MASOOD | SAHARANPUR | 14.70 |
| 196 | Sikkim | Indra Hang Subba | SIKKIM | 15.20 |
| 197 | Uttar Pradesh | IQRA CHOUDHARY | KAIRANA | 14.70 |
| 198 | West Bengal | ISHA KHAN CHOUDHURY | MALDAHA DAKSHIN | 14.70 |
| 199 | West Bengal | JAGADISH CHANDRA BARMA BASUNIA | COOCHBEHAR(SC) | 16.86 |
| 200 | Karnataka | JAGADISH SHETTAR | BELGAUM | 14.70 |
| 201 | West Bengal | Jagannath Sarkar | RANAGHAT(SC) | 14.70 |
| 202 | Uttar Pradesh | Jagdambika Pal | DOMARIYAGANJ | 16.06 |
| 203 | Haryana | JAI PARKASH | HISAR | 14.70 |
| 204 | Uttar Pradesh | Jai Prakash | HARDOI (SC) | 14.70 |
| 205 | Madhya Pradesh | Janardan Mishra | REWA | 14.70 |
| 206 | Gujarat | JASHUBHAI BHILUBHAI RATHVA | CHHOTA UDAIPUR(ST) | 14.70 |
| 207 | Gujarat | Jaswantsinh Sumanbhai Bhabhor | DAHOD(ST) | 14.70 |
| 208 | Bihar | JITAN RAM MANJHI | GAYA (SC) | 14.70 |
| 209 | Uttar Pradesh | JITENDRA KUMAR DOHARE | ETAWAH(SC) | 18.87 |
| 210 | Jammu And Kashmir | Jitendra Singh | UDHAMPUR | 14.70 |
| 211 | Uttar Pradesh | JITIN PRASADA | PILIBHIT | 14.70 |
| 212 | Jharkhand | JOBA MAJHI | SINGHBHUM(ST) | 14.70 |
| 213 | Assam | JOYANTA BASUMATARY | KOKRAJHAR (ST) | 14.70 |
| 214 | West Bengal | JUNE MALIAH | MEDINIPUR | 14.70 |
| 215 | Madhya Pradesh | JYOTIRADITYA M. SCINDIA | GUNA | 14.70 |
| 216 | Chhattisgarh | Jyotsna Charandas Mahant | KORBA | 15.52 |
| 217 | Tamil Nadu | K E PRAKASH | ERODE | 14.70 |
| 218 | Kerala | K RADHAKRISHNAN | ALATHUR(SC) | 14.70 |
| 219 | Tamil Nadu | K Subbarayan | TIRUPPUR | 14.70 |
| 220 | Kerala | K. C VENUGOPAL | ALAPPUZHA | 14.70 |
| 221 | Karnataka | K. RAJASHEKAR BASAVARAJ HITNAL | KOPPAL | 14.70 |
| 222 | Telangana | KADIYAM KAVYA | WARANGEL(SC) | 14.70 |
| 223 | West Bengal | Kakoli Ghosh Dastidar | BARASAT | 14.70 |
| 224 | The Dadra And Nagar Haveli And Daman And Diu | Kalaben Mohanbhai Delkar | DADRA & NAGAR HAVELI (ST) | 26.95 |
| 225 | Tamil Nadu | Kalanidhi Veeraswamy | CHENNAI NORTH | 17.15 |
| 226 | Jharkhand | KALI CHARAN MUNDA | KHUNTI(ST) | 14.70 |
| 227 | Jharkhand | KALI CHARAN SINGH | CHATRA | 14.70 |
| 228 | West Bengal | KALIPADA SAREN | JHARGRAM(ST) | 14.70 |
| 229 | West Bengal | Kalyan Banerjee | SREERAMPUR | 14.70 |
| 230 | Maharashtra | KALYAN VAIJINATHRAO KALE | JALNA | 14.70 |
| 231 | Assam | KAMAKHYA PRASAD TASA | Kaziranga | 14.70 |
| 232 | Delhi | Kamaljeet Sehrawat | WEST DELHI | 14.70 |
| 233 | Chhattisgarh | KAMLESH JANGDE | JANJGIR CHAMPA(SC) | 15.04 |
| 234 | Uttar Pradesh | Kamlesh Paswan | BANSGAON(SC) | 14.70 |
| 235 | Himachal Pradesh | Kangana Ranaut | MANDI | 14.70 |
| 236 | Tamil Nadu | Kani K Navas | RAMANATHAPURAM | 14.70 |
| 237 | Tamil Nadu | Kanimozhi Karunanidhi | THOOTHUKKUDI | 14.70 |
| 238 | Uttar Pradesh | KANWAR SINGH TANWAR | AMROHA | 14.70 |
| 239 | Uttar Pradesh | KARAN BHUSHAN SINGH | KAISERGANJ | 14.70 |
| 240 | West Bengal | KARTICK CHANDRA PAUL | RAIGANJ | 20.27 |
| 241 | Bihar | Kaushalendra Kumar | NALANDA | 14.70 |
| 242 | West Bengal | Khagen Murmu | MALDAHA UTTAR | 14.70 |
| 243 | West Bengal | Khalilur Rahaman | JANGIPUR | 14.70 |
| 244 | Andhra Pradesh | Kinjarapu Ram Mohan Naidu | SRIKAKULAM | 17.12 |
| 245 | Arunachal Pradesh | Kiren Rijiju | ARUNACHAL WEST | 14.70 |
| 246 | Uttar Pradesh | Kirti Vardhan Singh | GONDA | 14.70 |
| 247 | Telangana | Kishan Reddy Gangapuram | SECUNDERABAD | 14.70 |
| 248 | Uttar Pradesh | KISHORI LAL | AMETHI | 17.15 |
| 249 | Telangana | KONDA VISHWESHWAR REDDY | CHELVELLA | 23.37 |
| 250 | Karnataka | KOTA SRINIVAS POOJARY | UDUPI CHIKMAGALUR | 15.11 |
| 251 | Assam | Kripanath Mallah | KARIMGANJ (SC) | 14.70 |
| 252 | Haryana | Krishan Pal Gurjar | FARIDABAD | 14.70 |
| 253 | Uttar Pradesh | KRISHNA DEVI SHIVSHANKER PATEL | BANDA | 14.70 |
| 254 | Andhra Pradesh | Krishna Prasad Tenneti | BAPATLA | 16.78 |
| 255 | Tripura | KRITI DEVI DEBBARMAN | TRIPURA EAST(ST) | 14.70 |
| 256 | Rajasthan | KULDEEP INDORA | GANGANAGAR(SC) | 14.70 |
| 257 | Telangana | KUNDURU RAGHUVEER | NALGONDA | 16.30 |
| 258 | Uttar Pradesh | LALJI VERMA | AMBEDKAR NAGAR | 14.70 |
| 259 | Andhra Pradesh | Lavu Sri Krishna Devarayalu | NARASARAOPET | 17.40 |
| 260 | Uttar Pradesh | LAXMIKANT PAPPU NISHAD | SANT KABIR NAGAR | 14.70 |
| 261 | Bihar | LOVELY ANAND | SHEOHAR | 14.70 |
| 262 | Rajasthan | LUMBARAM | JALORE | 14.70 |
| 263 | Karnataka | M. MALLESH BABU | KOLAR(SC) | 14.71 |
| 264 | Tamil Nadu | M.K. VISHNUPRASAD | CUDDALORE | 14.70 |
| 265 | Andhra Pradesh | Maddila Gurumoorthy | TIRUPATI(SC) | 18.04 |
| 266 | Telangana | MADHAVANENI RAGHUNANDAN RAO | MEDAK | 14.70 |
| 267 | Andhra Pradesh | Magunta Sreenivasulu Reddy | ONGOLE | 14.70 |
| 268 | Madhya Pradesh | Mahendra Singh Solanky | DEWAS(SC) | 14.70 |
| 269 | Chhattisgarh | MAHESH KASHYAP | BASTAR(ST) | 14.70 |
| 270 | Uttar Pradesh | Mahesh Sharma | GAUTAM BUDDHA NAGAR | 14.88 |
| 271 | Rajasthan | MAHIMA KUMARI MEWAR | RAJSAMAND | 18.39 |
| 272 | Uttarakhand | Mala Rajya Laxmi Shah | TEHRI GARHWAL | 14.70 |
| 273 | West Bengal | Mala Roy | KOLKATA DAKSHIN | 14.70 |
| 274 | Tamil Nadu | MALAIYARASAN D | KALLAKURICHI | 20.16 |
| 275 | Odisha | MALVIKA DEVI | KALAHANDI | 14.70 |
| 276 | Punjab | MALVINDER SINGH KANG | ANANDPUR SAHIB | 14.70 |
| 277 | Tamil Nadu | MANI. A. | DHARAMAPURI | 16.45 |
| 278 | Tamil Nadu | Manickam Tagore B | VIRUDHUNAGAR | 14.70 |
| 279 | Jharkhand | MANISH JAISWAL | HAZARIBAGH | 14.70 |
| 280 | Chandigarh | MANISH TEWARI | CHANDIGARH | 17.84 |
| 281 | Rajasthan | MANJU SHARMA | JAIPUR | 16.71 |
| 282 | Rajasthan | MANNA LAL RAWAT | UDAIPUR(ST) | 14.70 |
| 283 | Haryana | MANOHAR LAL | KARNAL | 14.70 |
| 284 | Bihar | MANOJ KUMAR | SASARAM(SC) | 14.70 |
| 285 | West Bengal | MANOJ TIGGA | ALIPURDUARS(ST) | 14.70 |
| 286 | Delhi | Manoj Tiwari | NORTH EAST DELHI | 22.58 |
| 287 | Gujarat | Mansukhbhai Dhanjibhai Vasava | BHARUCH | 14.70 |
| 288 | Jammu And Kashmir | MIAN ALTAF AHMAD | ANANTNAG | 14.70 |
| 289 | Andhra Pradesh | Midhun Reddy | RAJAMPET | 17.90 |
| 290 | Bihar | MISHA BHARTI | PATALIPUTRA | 14.70 |
| 291 | Gujarat | Mitesh Rameshbhai Bakabhai Patel | ANAND | 14.70 |
| 292 | Ladakh | Mohamed Haneefa | LADAKH | 16.11 |
| 293 | Uttar Pradesh | MOHIBBULLAH | RAMPUR | 14.70 |
| 294 | Maharashtra | MOHITE PATIL DHAIRYASHEEL RAJSINH | MADHA | 19.56 |
| 295 | Bihar | Mr Gopal Jee Thakur | DARBHANGA | 14.70 |
| 296 | West Bengal | Ms Mahua Moitra | KRISHNANAGAR | 15.99 |
| 297 | Lakshadweep | MUHAMMED HAMDULLAH SAYEED | LAKSHADWEEP(ST) | 15.39 |
| 298 | Uttar Pradesh | Mukesh Rajput | FARRUKHABAD | 14.70 |
| 299 | Gujarat | MUKESHKUMAR CHANDRAKAANT DALAL | SURAT | 14.70 |
| 300 | Rajasthan | MURARI LAL MEENA | DAUSA(ST) | 14.70 |
| 301 | Tamil Nadu | MURASOLI S | THANJAVUR | 14.70 |
| 302 | Maharashtra | MURLIDHAR MOHOL | PUNE | 14.70 |
| 303 | Odisha | NABA CHARAN MAJHI | MAYURBHANJ (ST) | 14.76 |
| 304 | Jharkhand | NALIN SOREN | DUMKA(ST) | 14.74 |
| 305 | Uttar Pradesh | NARAYAN DAS AHIRWAR | JALAUN(SC) | 14.70 |
| 306 | Maharashtra | NARAYAN TATU RANE | RATNAGIRI-SINDHUDURG | 14.70 |
| 307 | Uttar Pradesh | NARESH CHANDRA UTTAM PATEL | FATEHPUR | 14.70 |
| 308 | Maharashtra | NARESH GANPAT MHASKE | THANE | 14.70 |
| 309 | Haryana | NAVEEN JINDAL | KURUKSHETRA | 14.70 |
| 310 | Uttar Pradesh | NEERAJ MAURYA | AONLA | 14.70 |
| 311 | Maharashtra | NILESH DNYANDEV LANKE | AHMEDNAGAR | 14.70 |
| 312 | Gujarat | NIMUBEN JAYANTIBHAI BAMBHANIYA | BHAVNAGAR | 14.70 |
| 313 | Jharkhand | Nishikant Dubey | GODDA | 14.70 |
| 314 | Maharashtra | Nitin Jairam Gadkari | NAGPUR | 16.82 |
| 315 | Bihar | Nityanand Rai | UJJARPUR | 14.70 |
| 316 | Rajasthan | Om Birla | KOTA | 16.39 |
| 317 | Maharashtra | Omprakash Bhupalsinh Alias Pawan Rajenimbalkar | OSMANABAD | 18.48 |
| 318 | Karnataka | P C Mohan | BANGALORE CENTRAL | 16.00 |
| 319 | Uttar Pradesh | Pankaj Chowdhary | MAHARAJGANJ_UP | 14.70 |
| 320 | Assam | PARIMAL SUKLABAIDYA | SILCHAR | 14.83 |
| 321 | Gujarat | PARSHOTTAMBHAI RUPALA | RAJKOT | 14.70 |
| 322 | West Bengal | PARTHA BHOWMICK | BARRACKPUR | 14.70 |
| 323 | Karnataka | Parvatagouda Chandanagouda Gaddigoudar | BAGALKOT | 16.75 |
| 324 | The Dadra And Nagar Haveli And Daman And Diu | PATEL UMESHBHAI BABUBHAI | DAMAN and DIU | 24.51 |
| 325 | West Bengal | PATHAN YUSUF | BAHARAMPUR | 14.70 |
| 326 | Assam | PHANI BHUSAN CHOUDHURY | BARPETA | 14.70 |
| 327 | Maharashtra | Piyush Vedprakash Goyal | MUMBAI NORTH | 14.70 |
| 328 | Andhra Pradesh | PRABHAKAR REDDY VEMIREDDY | NELLORE(SC) | 14.70 |
| 329 | Gujarat | Prabhubhai Nagarbhai Vasava | BARDOLI(ST) | 14.70 |
| 330 | Assam | Pradan Baruah | LAKHIMPUR | 14.70 |
| 331 | Bihar | Pradeep Kumar Singh | ARARIA | 14.70 |
| 332 | Odisha | PRADEEP PUROHIT | BARGARH | 14.70 |
| 333 | Assam | Pradyut Bordoloi | NOWGONG | 9.80 |
| 334 | Karnataka | Pralhad Venkatesh Joshi | DHARWAD | 15.50 |
| 335 | Maharashtra | PRANITI SUSHILKUMAR SHINDE | SOLAPUR(SC) | 14.70 |
| 336 | West Bengal | Prasun Banerjee | HOWRAH | 14.70 |
| 337 | Odisha | Pratap Chandra Sarangi | BALASORE | 14.71 |
| 338 | Maharashtra | Prataprao Jadhav | BULDHANA | 14.70 |
| 339 | West Bengal | Pratima Mondal | JOYNAGAR(SC) | 14.70 |
| 340 | Delhi | Praveen Khandelwal | CHANDINI CHOWK | 14.75 |
| 341 | Uttar Pradesh | PRAVEEN PATEL | PHULPUR | 15.16 |
| 342 | Uttar Pradesh | PRIYA SAROJ | MACHHLISHAHR(SC) | 14.70 |
| 343 | Kerala | Priyanka Gandhi Vadra | WAYANAD | 12.25 |
| 344 | Karnataka | PRIYANKA SATISH JARKIHOLI | CHIKKODI | 14.70 |
| 345 | West Bengal | Prof Sougata Ray | DUM DUM | 14.70 |
| 346 | Uttar Pradesh | Prof SP Singh Baghel | AGRA(SC) | 14.70 |
| 347 | Uttar Pradesh | PUSHPENDRA SAROJ | KAUSHAMBI(SC) | 14.70 |
| 348 | Andhra Pradesh | Putta Mahesh Kumar | ELURU | 14.70 |
| 349 | Uttar Pradesh | R.K. CHAUDHARY | MOHANLALGANJ(SC) | 14.70 |
| 350 | Odisha | RABINDRA NARAYAN BEHERA | JAJPUR(SC) | 14.71 |
| 351 | West Bengal | RACHNA BANERJEE | HOOGHLY | 14.70 |
| 352 | Bihar | Radha Mohan Singh | PURVI CHAMPARAN | 14.70 |
| 353 | Karnataka | RADHAKRISHNA | GULBARGA(SC) | 14.70 |
| 354 | Chhattisgarh | RADHE SHYAM RATHIYA | RAIGARH(ST) | 15.97 |
| 355 | Uttar Pradesh | RAHUL GANDHI | RAE BARELI | 14.70 |
| 356 | Rajasthan | Rahul Kaswan | CHURU | 14.70 |
| 357 | Madhya Pradesh | RAHUL SINGH LODHI | DAMOH | 16.31 |
| 358 | Bihar | RAJ BHUSHAN CHOUDHARY | MUZAFFARPUR | 14.70 |
| 359 | Rajasthan | RAJ KUMAR ROAT | BANSWARA(ST) | 14.70 |
| 360 | Bihar | RAJA RAM SINGH | KARAKAT | 14.70 |
| 361 | Maharashtra | RAJABHAU | NASHIK | 15.29 |
| 362 | Himachal Pradesh | RAJEEV BHARDWAJ | KANGRA | 17.94 |
| 363 | Uttar Pradesh | RAJEEV RAI | GHOSI | 14.70 |
| 364 | Bihar | RAJESH RANJAN ALIAS PAPPU YADAV | PURNEA | 14.70 |
| 365 | Bihar | RAJESH VERMA | KHAGARIA | 14.70 |
| 366 | Gujarat | Rajeshbhai Naranbhai Chudasama | JUNAGADH | 14.70 |
| 367 | Bihar | Rajiv Pratap Rudy | SARAN | 14.70 |
| 368 | Bihar | Rajiv Ranjan (Lalan) Singh | MUNGER | 14.70 |
| 369 | Uttar Pradesh | Rajkumar Chahar | FATEHPUR SIKRI | 14.70 |
| 370 | Uttar Pradesh | Rajnath Singh | LUCKNOW | 15.48 |
| 371 | Gujarat | RAJPALSINH MAHENDRASINH JADAV | PANCHMAHAL | 14.70 |
| 372 | West Bengal | Raju Bista | DARJEELING | 14.70 |
| 373 | Uttar Pradesh | RAKESH RATHOR | SITAPUR | 14.70 |
| 374 | Assam | RAKIBUL HUSSAIN | DHUBRI | 14.70 |
| 375 | Uttar Pradesh | RAM PRASAD CHAUDHARY | BASTI | 20.42 |
| 376 | Uttar Pradesh | Ram Shiromani | SHRAWASTI | 15.17 |
| 377 | Telangana | RAMASAHAYAM RAGHURAM REDDY | KHAMMAM | 14.70 |
| 378 | Uttar Pradesh | RAMASHANKAR RAJBHAR | SALEMPUR | 16.01 |
| 379 | Uttar Pradesh | RAMBHUAL NISHAD | SULTANPUR | 15.12 |
| 380 | Uttar Pradesh | RAMESH AWASTHI | KANPUR | 14.70 |
| 381 | Karnataka | Ramesh Chandappa Jigajinagi | BIJAPUR(SC) | 26.95 |
| 382 | Bihar | Ramprit Mandal | JHANJHARPUR | 14.70 |
| 383 | Delhi | Ramvir Singh Bidhuri | SOUTH DELHI | 14.76 |
| 384 | Assam | RANJIT DUTTA | Sonitpur | 14.70 |
| 385 | Haryana | Rao Inderjit Singh | GURGAON | 14.70 |
| 386 | Rajasthan | Rao Rajendra Singh | JAIPUR RURAL | 14.70 |
| 387 | Bihar | Ravi Shankar Prasad | PATNA SAHIB | 14.70 |
| 388 | Maharashtra | RAVINDRA DATTARAM WAIKAR | MUMBAI NORTH WEST | 14.70 |
| 389 | Uttar Pradesh | Ravindra Shyamnarayan Alias Ravi Kishan Shukla | GORAKHPUR | 14.70 |
| 390 | Maharashtra | Ravindra Vasantrao Chavan | NANDED | 14.70 |
| 391 | Mizoram | RICHARD VANLALHMANGAIHA | MIZORAM (ST) | 14.70 |
| 392 | Tamil Nadu | ROBERT BRUCE C | TIRUNELVELI | 14.75 |
| 393 | Madhya Pradesh | Rodmal Nagar | RAJGARH | 14.70 |
| 394 | Chhattisgarh | ROOP KUMARI CHOUDHARY | MAHASAMUND | 15.30 |
| 395 | Uttar Pradesh | RUCHI VIRA | MORADABAD | 14.70 |
| 396 | Odisha | RUDRA NARAYAN PANY | DHENKANAL | 15.50 |
| 397 | Nagaland | S SUPONGMEREN JAMIR | NAGALAND | 14.70 |
| 398 | Tamil Nadu | S Venkatesan | MADURAI | 14.70 |
| 399 | Tamil Nadu | S. Jagathrakshakan | ARAKKONAM | 18.06 |
| 400 | Tamil Nadu | SACHITHANANTHAM R | DINDIGUL | 14.70 |
| 401 | Karnataka | SAGAR ESHWAR KHANDRE | BIDAR | 14.70 |
| 402 | Meghalaya | SALENG A SANGMA | TURA | 14.70 |
| 403 | Odisha | SAMBIT PATRA | PURI | 14.70 |
| 404 | Uttar Pradesh | SANATAN PANDEY | BALLIA | 18.04 |
| 405 | Maharashtra | SANJAY DINA PATIL | MUMBAI NORTH EAST | 14.70 |
| 406 | Maharashtra | Sanjay Haribhau Jadhav | PARBHANI | 14.70 |
| 407 | Bihar | Sanjay Jaiswal | PASCHIM CHAMPARAN | 14.70 |
| 408 | Telangana | Sanjay Kumar Bandi | KARIMNAGAR | 17.28 |
| 409 | Jharkhand | Sanjay Seth | RANCHI | 14.71 |
| 410 | Maharashtra | Sanjay Uttamrao Deshmukh | YAVATMAL-WASHIM | 18.56 |
| 411 | Rajasthan | SANJNA JATAV | BHARATPUR(SC) | 14.70 |
| 412 | Chhattisgarh | Santosh Pandey | RAJNANDGAON | 14.70 |
| 413 | Odisha | Saptagiri Sankar Ulaka | KORAPUT(ST) | 26.95 |
| 414 | Punjab | SARABJEET SINGH KHALSA | FARIDKOT(SC) | 15.09 |
| 415 | Tamil Nadu | Sasikanth Senthil | TIRUVALLUR(SC) | 17.15 |
| 416 | Haryana | SATPAL BRAHAMCHARI | SONEPAT | 14.70 |
| 417 | West Bengal | Saumitra khan | BISHNUPUR(SC) | 14.70 |
| 418 | Madhya Pradesh | SAVITRI THAKUR | DHAR(ST) | 14.70 |
| 419 | West Bengal | SAYANI GHOSH | JADAVPUR | 14.70 |
| 420 | Haryana | SELJA | SIRSA(SC) | 14.70 |
| 421 | Tamil Nadu | SELVAGANAPATHI T M | SALEM | 14.70 |
| 422 | Tamil Nadu | SELVARAJ V | NAGAPATTINAM(SC) | 14.70 |
| 423 | Kerala | SHAFI PARAMBIL | VADAKARA | 14.70 |
| 424 | Bihar | SHAMBHAVI | SAMASTIPUR(SC) | 14.70 |
| 425 | Madhya Pradesh | Shankar Lalwani | INDORE | 14.70 |
| 426 | Uttar Pradesh | SHASHANK MANI | DEORIA | 14.70 |
| 427 | West Bengal | Shatrughan Sinha | ASANSOL | 14.70 |
| 428 | Punjab | SHER SINGH GHUBAYA | FIROZPUR | 14.70 |
| 429 | Madhya Pradesh | SHIVMANGAL SINGH TOMAR | MORENA | 14.70 |
| 430 | Madhya Pradesh | SHIVRAJ SINGH CHOUHAN | VIDISHA | 14.70 |
| 431 | Karnataka | SHOBHA KARANDLAJE | BANGALORE NORTH | 14.70 |
| 432 | Gujarat | SHOBHANABEN MAHENDRASINH BARAIYA | SABARKANTHA | 14.70 |
| 433 | Karnataka | SHREYAS. M. PATEL | HASSAN | 14.70 |
| 434 | Haryana | Shri Dharambir Singh | BHIWANI MAHENDRAGARH | 14.70 |
| 435 | West Bengal | Shri Abhishek Banerjee | DIAMOND HARBOUR | 14.70 |
| 436 | Punjab | Shri Amar Singh | FATEHGARH SAHIB(SC) | 14.70 |
| 437 | Gujarat | Shri Amit Shah | GANDHINAGAR | 14.70 |
| 438 | Madhya Pradesh | Shri Anil Firojiya | UJJAIN(SC) | 14.70 |
| 439 | Rajasthan | Shri Arjun Ram Meghwal | BIKANER(SC) | 14.70 |
| 440 | Uttar Pradesh | Shri Arun Kumar Sagar | SHAHJAHANPUR(SC) | 14.70 |
| 441 | Karnataka | Shri B Y Raghavendra | SHIMOGA | 14.70 |
| 442 | Kerala | Shri Benny Behanan | CHALAKUDY | 16.47 |
| 443 | Odisha | Shri Bhartruhari Mahtab | CUTTACK | 14.70 |
| 444 | Jharkhand | Shri Chandra Prakash Choudhary | GIRIDIH | 14.70 |
| 445 | West Bengal | Shri Deepak (Dev) Adhikari | GHATAL | 20.07 |
| 446 | Punjab | Shri Gurjeet Singh Aujla | AMRITSAR | 14.70 |
| 447 | Rajasthan | Shri Hanuman Beniwal | NAGAUR | 14.70 |
| 448 | Kerala | Shri Hibi Eden | ERNAKULAM | 16.22 |
| 449 | Bihar | Shri Janardan Singh Sigriwal | MAHARAJGANJ_BR | 14.70 |
| 450 | Odisha | Shri Jual Oram | SUNDARGARH (ST) | 17.31 |
| 451 | Jammu And Kashmir | Shri Jugal Kishore Sharma | JAMMU | 14.70 |
| 452 | West Bengal | Shri Jyotirmay Singh Mahato | PURULIA | 14.70 |
| 453 | Tamil Nadu | Shri Karti P Chidambaram | SIVAGANGA | 15.90 |
| 454 | Kerala | Shri Kumbakudi Sudhakaran | KANNUR | 14.70 |
| 455 | Karnataka | Shri LS Tejasvi Surya | BANGALORE SOUTH | 14.70 |
| 456 | Kerala | Shri M K Raghavan | KOZHIKODE | 14.70 |
| 457 | Uttar Pradesh | Shri Narendra Modi | VARANASI | 16.21 |
| 458 | Kerala | Shri NK Premachandran | KOLLAM | 17.15 |
| 459 | Rajasthan | Shri PP Chaudhary | PALI | 14.70 |
| 460 | Kerala | Shri Rajmohan Unnithan | KASARAGOD | 15.68 |
| 461 | Assam | Shri Sarbananda Sonowal (18LS) | DIBRUGARH | 14.70 |
| 462 | Uttar Pradesh | Shri Satish Kumar Gautam | ALIGARH | 14.70 |
| 463 | West Bengal | Shri Shantanu Thakur | BANGAON(SC) | 14.70 |
| 464 | Madhya Pradesh | Shri Sudheer Gupta | MANDSOUR | 14.90 |
| 465 | Kerala | Shri Suresh Kodikunnil | MAVELIKKARA(SC) | 17.24 |
| 466 | Arunachal Pradesh | Shri Tapir Gao | ARUNACHAL EAST | 14.70 |
| 467 | Tamil Nadu | Shri vijayakumar Vasanth | KANNIYAKUMARI | 17.15 |
| 468 | Maharashtra | Shrikant Eknath Shinde | KALYAN | 14.70 |
| 469 | Maharashtra | SHRIMANT CHH UDAYANRAJE PRATAPSINHAMAHARAJ BHONSLE | SATARA | 14.70 |
| 470 | Goa | Shripad Yesso Naik | NORTH GOA | 14.70 |
| 471 | Maharashtra | Shrirang Appa Barne | MAVAL | 14.70 |
| 472 | Maharashtra | Shyamkumar | RAMTEK(SC) | 14.70 |
| 473 | Andhra Pradesh | Sivanath Kesineni | VIJAYAWADA | 15.99 |
| 474 | West Bengal | SK NURUL ISLAM | BASIRHAT | 4.90 |
| 475 | Maharashtra | SMITA UDAY WAGH | JALGAON | 14.81 |
| 476 | Uttar Pradesh | Smt Anupriya Patel | MIRZAPUR | 14.70 |
| 477 | Odisha | Smt Aparajita Sarangi | BHUBANESWAR | 14.74 |
| 478 | Uttar Pradesh | Smt Dimple Yadav | MAINPURI | 19.20 |
| 479 | Punjab | Smt Harsimrat Kaur Badal | BHATINDA | 15.98 |
| 480 | Uttar Pradesh | Smt Hema Malini | MATHURA | 14.70 |
| 481 | Madhya Pradesh | Smt Himadri Singh | SHAHDOL (ST) | 15.07 |
| 482 | Gujarat | Smt Poonamben Hematbhai Maadam | JAMNAGAR | 14.70 |
| 483 | Maharashtra | Smt Raksha Nikhil Khadse | RAVER | 15.31 |
| 484 | Tamil Nadu | Smt S Jothimani | KARUR | 14.70 |
| 485 | West Bengal | Smt Sajda Ahmed | ULUBERIA | 14.70 |
| 486 | Madhya Pradesh | Smt Sandhya Ray | BHIND(SC) | 14.70 |
| 487 | Odisha | Smt Sangeeta Kumari Singh Deo | BOLANGIR | 14.70 |
| 488 | West Bengal | Smt Satabdi Roy (Banerjee) | BIRBHUM | 14.70 |
| 489 | Maharashtra | Smt Supriya Sadanand Sule | BARAMATI | 14.70 |
| 490 | Bihar | Smt Veena Devi | VAISHALI | 14.70 |
| 491 | Andhra Pradesh | Sribharat MathuKumli | VISAKHAPATNAM | 16.48 |
| 492 | Bihar | SUDAMA PRASAD | ARRAH | 14.70 |
| 493 | Tamil Nadu | SUDHA R | MAYILADUTHURAI | 14.73 |
| 494 | Bihar | SUDHAKAR SINGH | BUXAR | 18.52 |
| 495 | West Bengal | Sudip Bandyopadhyay | KOLKATA UTTAR | 14.70 |
| 496 | Odisha | SUKANTA KUMAR PANIGRAHI | KANDHAMAL | 19.07 |
| 497 | Jharkhand | SUKHDEO BHAGAT | LOHARDAGA(ST) | 17.18 |
| 498 | Punjab | SUKHJINDER SINGH RANDHAWA | GURDASPUR | 14.70 |
| 499 | Karnataka | SUNIL BOSE | CHAMARAJANAGAR(SC) | 14.70 |
| 500 | Maharashtra | Sunil Dattatray Tatkare | RAIGAD | 14.70 |
| 501 | Bihar | Sunil Kumar | VALMIKI NAGAR | 14.70 |
| 502 | Bihar | SURENDRA PRASAD YADAV | JAHANABAD | 15.53 |
| 503 | Kerala | SURESH GOPI | THRISSUR | 14.70 |
| 504 | Himachal Pradesh | Suresh Kumar Kashyap | SHIMLA (SC) | 15.36 |
| 505 | Telangana | SURESH KUMAR SHETKAR | ZAHIRABAD | 14.70 |
| 506 | Uttar Pradesh | Swami Sachchidanandhari Sakshi ji Maharaj | UNNAO | 14.70 |
| 507 | Tamil Nadu | T Sumathy (A) Thamizhachi Thangapandian | CHENNAI SOUTH | 14.70 |
| 508 | Andhra Pradesh | TANGELLA UDAY SRINIVAS | KAKINADA | 19.94 |
| 509 | Uttar Pradesh | TANUJ PUNIA | BARABANKI(SC) | 14.82 |
| 510 | Bihar | TARIQ ANWAR | KATIHAR | 14.70 |
| 511 | Tamil Nadu | Thalikkottai Rajuthevar Baalu | SRIPERUMBUDUR | 19.69 |
| 512 | Tamil Nadu | THANGA TAMILSELVAN | THENI | 16.78 |
| 513 | Tamil Nadu | THARANIVENTHAN M S | ARANI | 16.83 |
| 514 | Tamil Nadu | Thiru Dayanidhi Maran | CHENNAI CENTRAL | 14.70 |
| 515 | Tamil Nadu | Thirumaa Valavan Thol | CHIDAMBARAM(SC) | 14.70 |
| 516 | Chhattisgarh | TOKHAN SAHU | BILASPUR | 14.70 |
| 517 | Uttarakhand | TRIVENDRA SINGH RAWAT | HARDWAR | 14.70 |
| 518 | Uttar Pradesh | UJJWAL RAMAN SINGH | ALLAHABAD | 14.70 |
| 519 | Rajasthan | UMMEDA RAM BENIWAL | BARMER | 14.70 |
| 520 | Uttar Pradesh | UTKARSH VERMA MADHUR | KHERI | 14.70 |
| 521 | Tamil Nadu | V S Matheswaran | NAMAKKAL | 16.25 |
| 522 | Karnataka | V. SOMANNA | TUMKUR | 14.70 |
| 523 | Puducherry | Vaithilingam Ve | Puducherry | 20.94 |
| 524 | Telangana | VAMSI KRISHNA GADDAM | PEDDAPALLE | 14.85 |
| 525 | Haryana | VARUN CHAUDHRY | AMBALA (SC) | 25.55 |
| 526 | Kerala | Vellalath Kochukrishnan Nair Sreekandan | PALAKKAD | 16.78 |
| 527 | Chhattisgarh | Vijay Baghel | DURG | 14.70 |
| 528 | Uttar Pradesh | Vijay Kumar Dubey | KUSHI NAGAR | 14.89 |
| 529 | Jharkhand | Vijay Kumar Hansdak | RAJMAHAL(ST) | 14.72 |
| 530 | Bihar | VIJAYLAKSHMI DEVI | SIWAN | 14.70 |
| 531 | Gujarat | Vinod Chavda | KACHCHH(SC) | 14.70 |
| 532 | Uttar Pradesh | VINOD KUMAR BIND | BHADOHI | 14.70 |
| 533 | Madhya Pradesh | Virendra Kumar | TIKAMGARH(SC) | 14.70 |
| 534 | Uttar Pradesh | VIRENDRA SINGH | CHANDAULI | 14.70 |
| 535 | Maharashtra | VISHAL | SANGLI | 14.70 |
| 536 | Jharkhand | Vishnu Dayal Ram | PALAMU(SC) | 15.82 |
| 537 | Madhya Pradesh | Vishnu Dutt Sharma | KHAJURAHO | 14.70 |
| 538 | Karnataka | VISHWESHWAR HEGDE KAGERI | UTTARA KANNADA | 14.70 |
| 539 | Bihar | VIVEK THAKUR | NAWADA | 14.70 |
| 540 | Andhra Pradesh | Y S Avinash Reddy | KADAPA | 15.64 |
| 541 | Karnataka | YADUVEER KRISHNADATTA CHAMARAJA WADIYAR | MYSORE | 14.70 |
| 542 | Delhi | Yogendra Chandoliya | NORTH WEST DELHI(SC) | 14.79 |
| 543 | Uttar Pradesh | ZIA UR REHMAN | SAMBHAL | 14.70 |
---

## 2. Public Project Examples (Real)

**Source:** provided directly by the user. These are the real project examples referenced in the PRD's Public Project & Bidding Page (§4.1) and Contractor Dashboard (§4.2) modules.

**Note on interaction pattern:** a **completed** project opens a detail card on click, showing project details plus a payment/installment timeline. An **incomplete** project does **not** open a card — clicking it should not surface a detail view in the prototype (only completed projects have the full card treatment demonstrated here).

### Project 1 — Completed

| Field | Value |
|---|---|
| Title | Laying of 900mm dia and 600mm dia Np-3 pipe line and CC road restoration from H.No. 17-4-387, Ashoorkhana Hazrat-e-Ameer Muqtar to H.No. 17-4-313 A and bylanes in Matha Kidiki Nala, Yakutpura Assembly Constituency |
| Status | Completed (opens detail card on click) |
| Sanctioned Cost | ₹56,56,600 |
| MP | Asaduddin Owaisi |
| Constituency | Hyderabad |

**Detail card contents (shown on click):**
- Above fields, plus payment details:
- Total Installments: 1
- Total Amount Paid: ₹56.6 L
- Payment Timeline:
  - 28 Nov 2025 — 1 payment: ₹56.6 L — Payment Success

### Project 2 — Completed

| Field | Value |
|---|---|
| Title | Construction of Bus shelter at Kodaiyanchi Panchayat, Natrampalli Union |
| Status | Completed (opens detail card on click) |
| Sanctioned Cost | ₹10,97,477 |
| MP | D M Kathir Anand |
| Constituency | Vellore |
| Work ID | 200525 |

**Detail card contents (shown on click):**
- Above fields, plus payment details:
- Total Installments: 2
- Total Amount Paid: ₹11 L
- Payment Timeline:
  - 23 Mar 2026 — 1 payment: ₹6 L — Payment Success
  - 5 Jan 2026 — 1 payment: ₹5 L — Payment Success

### Project 3 — Incomplete

| Field | Value |
|---|---|
| Title | Construction of 60 × 120ft roof near Chamundeeshwari Amman Temple at Periyankuppam Panchayat, Madanur Union |
| Status | Incomplete (does **not** open a detail card) |
| Sanctioned Cost | ₹25,00,000 |
| MP | D M Kathir Anand |
| Constituency | Vellore |
| Work ID | 200526 |
| Sanctioned Date | 20 Nov 2024 |

### Project 4 — Incomplete

| Field | Value |
|---|---|
| Title | Providing of Bharat Benz 1017 5300WB BS VI, G85 49+1+D 3x2 Bus with Free Flow Rexin by BX with ABS and Speed Limiter ECU, with Insurance for 1 year to Government Nizamia Tibbi College, Charminar, Hyderabad |
| Status | Incomplete (does **not** open a detail card) |
| Sanctioned Cost | ₹43,56,840 |
| MP | Asaduddin Owaisi |
| Constituency | Hyderabad |

---

## 3. Open Items / Gaps

1. **MP allocation Sr. No. 108** has no amount in the source PDF — needs a decision on whether to fill it with a fake/estimated value for demo purposes or display it as "data not available."
2. **Fewer than the 5–7 project examples** originally scoped in the PRD have been supplied so far (4 given here — 2 completed, 2 incomplete). More can be added following the same structure above; any remaining slots needed to round out the public listing page will use fake data per the PRD's data approach.
