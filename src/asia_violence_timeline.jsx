import React, { useState, useMemo } from 'react';

const START_YEAR = 1945;
const END_YEAR = 2026;

export const REGIONS = {
  "East Asia":      { color: "#c4615d", soft: "rgba(196,97,93,0.16)",  ring: "rgba(196,97,93,0.45)" },
  "Southeast Asia": { color: "#5a8a85", soft: "rgba(90,138,133,0.16)", ring: "rgba(90,138,133,0.45)" },
  "South Asia":     { color: "#c69449", soft: "rgba(198,148,73,0.16)", ring: "rgba(198,148,73,0.45)" },
  "Central Asia":   { color: "#9683b8", soft: "rgba(150,131,184,0.16)",ring: "rgba(150,131,184,0.45)" },
  "West Asia":      { color: "#b97a55", soft: "rgba(185,122,85,0.16)", ring: "rgba(185,122,85,0.45)" },
};

export const CITATIONS = [
  { n: 1,  text: "Uppsala Conflict Data Program (UCDP), Uppsala University.", url: "https://ucdp.uu.se" },
  { n: 2,  text: "Peace Research Institute Oslo (PRIO), Battle Deaths Dataset.", url: "https://www.prio.org/data" },
  { n: 3,  text: "Armed Conflict Location and Event Data Project (ACLED).", url: "https://acleddata.com" },
  { n: 4,  text: "UNHCR Operational Data Portal.", url: "https://data.unhcr.org" },
  { n: 5,  text: "Encyclopedia Britannica (multiple entries).", url: "https://www.britannica.com" },
  { n: 6,  text: "Human Rights Watch, World Reports and country investigations.", url: "https://www.hrw.org" },
  { n: 7,  text: "Amnesty International, country reports and urgent actions.", url: "https://www.amnesty.org" },
  { n: 8,  text: "UN OHCHR, Commissions of Inquiry.", url: "https://www.ohchr.org" },
  { n: 9,  text: "Brown University Costs of War, Watson Institute.", url: "https://costsofwar.watson.brown.edu" },
  { n: 10, text: "Yang Jisheng, Tombstone: The Great Chinese Famine, 1958 to 1962 (Farrar, Straus and Giroux, 2012).", url: "https://en.wikipedia.org/wiki/Tombstone_(book)" },
  { n: 11, text: "Frank Dik\u00f6tter, Mao's Great Famine (Walker and Company, 2010).", url: "https://en.wikipedia.org/wiki/Mao%27s_Great_Famine" },
  { n: 12, text: "Frank Dik\u00f6tter, The Tragedy of Liberation (Bloomsbury, 2013).", url: "https://en.wikipedia.org/wiki/Frank_Dik%C3%B6tter" },
  { n: 13, text: "Judith Banister, China's Changing Population (Stanford University Press, 1987).", url: "https://en.wikipedia.org/wiki/Demographics_of_China" },
  { n: 14, text: "Andrew G. Walder, county-annal analysis of Cultural Revolution violence (Stanford, 2014 onward).", url: "https://news.stanford.edu/stories/2019/10/violence-unfolded-chinas-cultural-revolution" },
  { n: 15, text: "Roderick MacFarquhar and Michael Schoenhals, Mao's Last Revolution (Harvard, 2006).", url: "https://en.wikipedia.org/wiki/Mao%27s_Last_Revolution" },
  { n: 16, text: "Daniel Goodkind and Loraine West, The North Korean Famine and Its Demographic Impact, Population and Development Review (2001).", url: "https://en.wikipedia.org/wiki/North_Korean_famine" },
  { n: 17, text: "Andrei Lankov, Staying Alive, Foreign Affairs (March/April 2008).", url: "https://www.foreignaffairs.com" },
  { n: 18, text: "Ian Talbot and Gurharpal Singh, The Partition of India (Cambridge University Press, 2009).", url: "https://en.wikipedia.org/wiki/Partition_of_India" },
  { n: 19, text: "Yang Kuisong, Reconsidering the Campaign to Suppress Counterrevolutionaries, The China Quarterly 193 (March 2008).", url: "https://en.wikipedia.org/wiki/Campaign_to_Suppress_Counterrevolutionaries" },
  { n: 20, text: "Adrian Zenz, Jamestown Foundation (November 2019); ASPI Xinjiang Data Project.", url: "https://xjdp.aspi.org.au" },
  { n: 21, text: "UN Independent Fact-Finding Mission on Myanmar, A/HRC/39/64 (September 2018).", url: "https://www.ohchr.org/en/hr-bodies/hrc/myanmar-ffm/index" },
  { n: 22, text: "CAVR Final Report, Chega! (Commission for Reception, Truth and Reconciliation in Timor-Leste, 2005).", url: "https://en.wikipedia.org/wiki/Commission_for_Reception,_Truth_and_Reconciliation_in_East_Timor" },
  { n: 23, text: "UN Panel of Experts on Accountability in Sri Lanka (March 2011).", url: "https://en.wikipedia.org/wiki/UN_Panel_of_Experts_Report_on_Sri_Lanka" },
  { n: 24, text: "Hagopian et al., Mortality in Iraq, PLOS Medicine (2013).", url: "https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1001533" },
  { n: 25, text: "Syrian Network for Human Rights.", url: "https://snhr.org" },
  { n: 26, text: "Global Centre for the Responsibility to Protect, Syria.", url: "https://www.globalr2p.org" },
  { n: 27, text: "Casualties of the Gaza War, Gaza Health Ministry and Israeli MFA (3 May 2026).", url: "https://en.wikipedia.org/wiki/Casualties_of_the_Gaza_war" },
  { n: 28, text: "HRANA News Agency, Twelve Days Under Fire (June 28, 2025).", url: "https://www.en-hrana.org/twelve-days-under-fire-a-comprehensive-report-on-the-iran-israel-war/" },
  { n: 29, text: "Times of Israel, June 24, 2025 (Emanuel Fabian).", url: "https://www.timesofisrael.com" },
  { n: 30, text: "UK House of Commons Library, CBP-10108.", url: "https://commonslibrary.parliament.uk" },
  { n: 31, text: "Al Jazeera, December 27, 2025 (Myanmar civil war).", url: "https://www.aljazeera.com" },
  { n: 32, text: "CNN, December 27, 2025 (Thailand-Cambodia ceasefire).", url: "https://www.cnn.com" },
  { n: 33, text: "OHCHR press briefing, April 24, 2026 (Thameen Al-Kheetan).", url: "https://www.ohchr.org/en/news/press-briefing-notes" },
  { n: 34, text: "UN Commission of Inquiry on Syria, August 2025 report.", url: "https://www.ohchr.org/en/hr-bodies/hrc/iici-syria/index" },
  { n: 35, text: "China Tribunal, Final Judgment (June 17, 2019), chaired by Sir Geoffrey Nice KC.", url: "https://chinatribunal.com" },
  { n: 36, text: "UN Commission of Inquiry on Human Rights in the DPRK, A/HRC/25/63 (February 2014).", url: "https://www.ohchr.org/en/hr-bodies/hrc/co-i-dprk/report-commission-inquiry-dprk" },
  { n: 37, text: "UN Commission of Inquiry, They Came to Destroy: ISIS Crimes Against the Yazidis (June 15, 2016).", url: "https://www.ohchr.org/en/news/2016/06/un-inquiry-isis-may-be-committing-genocide-against-yazidis" },
  { n: 38, text: "Karlinsky et al., Excess Mortality in the 2020 Nagorno-Karabakh Conflict (2023).", url: "https://link.springer.com/journal/11113" },
  { n: 39, text: "Rahman et al., Bangladeshi Refugees 1971, PLOS One (2025).", url: "https://journals.plos.org/plosone" },
  { n: 40, text: "UN Special Rapporteur on Iran (Javaid Rehman), July 2024.", url: "https://www.ohchr.org/en/special-procedures/sr-iran" },
  { n: 41, text: "Wikipedia (verified against primary sources cited).", url: "https://en.wikipedia.org/wiki/List_of_conflicts_in_Asia" },
  { n: 42, text: "Crawford, Neta, The Human Toll of the Gaza War (Costs of War, October 2025).", url: "https://costsofwar.watson.brown.edu/paper/HumanTollGaza" },
  { n: 43, text: "Maurice Meisner, Mao's China and After (Free Press, 1999); Philip Short, Mao: A Life (Henry Holt, 1999).", url: "https://en.wikipedia.org/wiki/Mao%27s_China_and_After" },
  { n: 44, text: "Sarmila Bose, Dead Reckoning (Hurst, 2011).", url: "https://en.wikipedia.org/wiki/Sarmila_Bose" },
  { n: 45, text: "Odd Arne Westad, The Global Cold War: Third World Interventions and the Making of Our Times (Cambridge University Press, 2005).", url: "https://www.cambridge.org/core/books/global-cold-war/8C26ADB4D4DB72EFE9F9FE08B3C56E96" },
  { n: 46, text: "Frederick Cooper, Citizenship between Empire and Nation: Remaking France and French Africa, 1945 to 1960 (Princeton University Press, 2014).", url: "https://press.princeton.edu/books/paperback/9780691161310/citizenship-between-empire-and-nation" },
  { n: 47, text: "Bethany Lacina and Nils Petter Gleditsch, Monitoring Trends in Global Combat: A New Dataset of Battle Deaths, European Journal of Population 21, no. 2-3 (2005): 145-166.", url: "https://link.springer.com/article/10.1007/s10680-005-6851-6" },
  { n: 48, text: "Meredith L. Weiss, The Roots of Resilience: Party Machines and Grassroots Politics in Southeast Asia (Cornell University Press, 2020).", url: "https://www.cornellpress.cornell.edu/book/9781501752278/the-roots-of-resilience/" },
  { n: 49, text: "Morris Rossabi, Modern Mongolia: From Khans to Commissars to Capitalists (University of California Press, 2005).", url: "https://www.ucpress.edu/books/modern-mongolia/paper" },
  { n: 50, text: "John W. Dower, Embracing Defeat: Japan in the Wake of World War II (W. W. Norton, 1999).", url: "https://en.wikipedia.org/wiki/Embracing_Defeat" },
  { n: 51, text: "Chalmers Johnson, MITI and the Japanese Miracle: The Growth of Industrial Policy, 1925 to 1975 (Stanford University Press, 1982).", url: "https://www.sup.org/books/politics/miti-and-japanese-miracle" },
  { n: 52, text: "Treaty of Mutual Cooperation and Security between the United States and Japan (signed January 19, 1960).", url: "https://en.wikipedia.org/wiki/Treaty_of_Mutual_Cooperation_and_Security_between_the_United_States_and_Japan" },
  { n: 53, text: "Constitution of Japan, Article 9 (effective May 3, 1947).", url: "https://en.wikipedia.org/wiki/Article_9_of_the_Japanese_Constitution" },
  { n: 54, text: "Erika Lee, The Making of Asian America: A History (Simon & Schuster, 2015).", url: "https://www.simonandschuster.com/books/The-Making-of-Asian-America/Erika-Lee/9781476739410" },
  { n: 55, text: "Lisa Lowe, Immigrant Acts: On Asian American Cultural Politics (Duke University Press, 1996).", url: "https://www.dukeupress.edu/immigrant-acts" },
  { n: 56, text: "Yen Le Espiritu, Body Counts: The Vietnam War and Militarized Refuge(es) (University of California Press, 2014).", url: "https://www.ucpress.edu/books/body-counts/paper" },
  { n: 57, text: "Christopher Bayly and Tim Harper, Forgotten Wars: Freedom and Revolution in Southeast Asia (Harvard University Press, 2007).", url: "https://www.hup.harvard.edu/books/9780674057081" },
  { n: 58, text: "Prasenjit Duara, ed., Decolonization: Perspectives from Now and Then (Routledge, 2004).", url: "https://www.routledge.com/Decolonization-Perspectives-from-Now-and-Then/Duara/p/book/9780415248419" },
  { n: 59, text: "Human Rights Watch, Bhutan's Ethnic Cleansing (February 1, 2008).", url: "https://www.hrw.org/news/2008/02/01/bhutans-ethnic-cleansing" },
  { n: 60, text: "Barbara Harff, No Lessons Learned from the Holocaust? Assessing Risks of Genocide and Political Mass Murder since 1955, American Political Science Review 97, no. 1 (2003), Genocide/Politicide dataset.", url: "https://www.systemicpeace.org/inscrdata.html" },
  { n: 61, text: "Mark Gibney and colleagues, the Political Terror Scale.", url: "http://www.politicalterrorscale.org/" },
  { n: 62, text: "Political Instability Task Force (PITF), State Failure dataset, Center for Systemic Peace.", url: "https://www.systemicpeace.org/inscr/inscr.htm" },
  { n: 63, text: "Sarah Wildman, How One Woman's Story Led to the Creation of Asian Pacific American Heritage Month, TIME (May 2019), supplemented by the Federal Asian Pacific American Council historical record.", url: "https://time.com/5592591/asian-pacific-heritage-month-history/" },
  { n: 64, text: "Government of Canada, About Asian Heritage Month.", url: "https://www.canada.ca/en/canadian-heritage/campaigns/asian-heritage-month/about.html" },
  { n: 65, text: "Senate of Canada, on the Honourable Vivienne Poy and the 2001 motion designating May as Asian Heritage Month.", url: "https://sencanada.ca/en/sencaplus/news/seven-senators-pay-tribute-to-inspirational-asian-canadians/" },
];

export const COUNTRY_REGION = {
  "China": "East Asia",
  "Taiwan": "East Asia",
  "North Korea": "East Asia",
  "South Korea": "East Asia",
  "Soviet Union": "East Asia",
  "Indonesia": "Southeast Asia",
  "Vietnam": "Southeast Asia",
  "Philippines": "Southeast Asia",
  "Malaysia": "Southeast Asia",
  "Myanmar": "Southeast Asia",
  "Laos": "Southeast Asia",
  "Cambodia": "Southeast Asia",
  "Thailand": "Southeast Asia",
  "Timor-Leste": "Southeast Asia",
  "India": "South Asia",
  "Pakistan": "South Asia",
  "Bangladesh": "South Asia",
  "Bhutan": "South Asia",
  "Nepal": "South Asia",
  "Sri Lanka": "South Asia",
  "Maldives": "South Asia",
  "Afghanistan": "South Asia",
  "Tajikistan": "Central Asia",
  "Kyrgyzstan": "Central Asia",
  "Uzbekistan": "Central Asia",
  "Israel": "West Asia",
  "Palestine": "West Asia",
  "Egypt": "West Asia",
  "Lebanon": "West Asia",
  "Iraq": "West Asia",
  "Syria": "West Asia",
  "Iran": "West Asia",
  "Turkey": "West Asia",
  "Yemen": "West Asia",
  "Jordan": "West Asia",
  "Saudi Arabia": "West Asia",
  "Kuwait": "West Asia",
  "Oman": "West Asia",
  "Armenia": "West Asia",
  "Azerbaijan": "West Asia"
};

export const EVENTS = [
  { name: "Chinese Civil War (Resumed)", countries: ["China"], region: "East Asia", category: "Armed Conflict", start: 1946, end: 1949, deaths: "2 to 6 M", displaced: "~5 M",
    note: "When the Marshall Mission collapsed in early 1946, the uneasy wartime truce between the **Chinese Communist Party** and the **Kuomintang** dissolved into a continental war that the Communists ultimately won by exploiting agrarian grievance, KMT mismanagement of the Manchurian recovery, and decisive operational coordination during the Liaoshen, Huaihai, and Pingjin campaigns of 1948 and 1949. PRIO's mid-range battle-death estimate is roughly two million, and a wider casualty count that includes famine, one-sided violence, and the cumulative effects of disrupted agriculture climbs toward six million. Mao Zedong proclaimed the People's Republic on 1 October 1949, and Chiang Kai-shek's remaining forces retreated to Taiwan along with roughly two million civilians and most of the Imperial collections from the Palace Museum. The outcome structured the Cold War in East Asia, locked in the unresolved Taiwan question that continues to shape regional security, and gave the Chinese Communist Party the unchallenged authority over which the coming campaigns of mass political violence would be built.",
    cites: [1, 2, 5] },
  { name: "Tibetan Annexation and 1959 Uprising", countries: ["China"], region: "East Asia", category: "Armed Conflict", start: 1950, end: 1959, deaths: "~80k", displaced: "~150k exiles",
    note: "The People's Liberation Army entered eastern Tibet in October 1950 and formalised the new sovereignty through the **Seventeen Point Agreement** signed under duress the following year. Tensions over land reform in Kham and Amdo built into a continent-wide resistance that culminated in the **March 1959 Lhasa uprising**, during which the 14th Dalai Lama escaped over the Himalayas to Dharamshala and established the government-in-exile that has shaped Tibetan diasporic politics ever since. PRIO records roughly twelve thousand battle deaths in and around Lhasa alone; the Central Tibetan Administration cites a far higher figure of 87,000 covering cumulative deaths through 1965, a number that historians treat with appropriate caution. The CIA-trained Tibetan resistance based at Camp Hale in Colorado fought a covert war into the late 1960s, but the political settlement that followed entrenched Beijing's administrative control and set up the cultural destruction that the Cultural Revolution would soon impose.",
    cites: [1, 2, 41] },
  { name: "Korean War", countries: ["North Korea", "South Korea"], region: "East Asia", category: "Armed Conflict", start: 1950, end: 1953, deaths: "~3 M", displaced: "~5 M",
    note: "Kim Il Sung's **invasion of the South on 25 June 1950** triggered the first hot war of the bipolar order and the first armed intervention authorised by the UN Security Council under Resolution 82, made possible only by the Soviet boycott then in effect. American-led forces under Douglas MacArthur reversed the initial collapse with the Inchon landing in September, only to provoke Chinese intervention in October when UN forces approached the Yalu River. The Lacina and Gleditsch synthesis at PRIO puts Korean civilian deaths at approximately 2.73 million with a further 793,000 military fatalities, and roughly 4.5 million North Koreans were displaced southward or abroad. The **armistice signed at Panmunjom on 27 July 1953** halted the fighting along a line very close to the original frontier without a peace treaty, leaving the peninsula divided and the demilitarised zone as the most heavily fortified border in the world.",
    cites: [1, 2, 5] },
  { name: "First Taiwan Strait Crisis", countries: ["China", "Taiwan"], region: "East Asia", category: "Armed Conflict", start: 1954, end: 1955, deaths: "~6k", displaced: "~10k",
    note: "Beginning with the PLA's shelling of **Quemoy on 3 September 1954** and culminating in the seizure of the Yijiangshan Islands in January 1955, the first crisis tested whether the United States would defend the offshore islands that the Republic of China still held. Washington's response combined the **Sino-American Mutual Defense Treaty** of December 1954, the Formosa Resolution of January 1955 authorising the use of force, and an explicit nuclear threat communicated through diplomatic channels. The crisis ended without a clear victor but effectively froze the cross-Strait military line at the offshore islands and embedded Taiwan in the American alliance system for the duration of the Cold War. It also catalysed Mao Zedong's nuclear weapons programme, which delivered its first device in 1964.",
    cites: [5, 41] },
  { name: "Second Taiwan Strait Crisis", countries: ["China", "Taiwan"], region: "East Asia", category: "Armed Conflict", start: 1958, end: 1958, deaths: "~1k", displaced: "minimal",
    note: "From **23 August to 5 October 1958**, the PLA mounted a sustained artillery bombardment of Quemoy and Matsu while the US Seventh Fleet escorted Republic of China resupply convoys to the islands and again signalled its willingness to use nuclear weapons. Mao's brinkmanship was partly motivated by a desire to test American resolve and partly by domestic mobilisation needs during the early Great Leap Forward, but the operational result was a stalemate that confirmed the cross-Strait status quo. The crisis revealed both the limits of Soviet support, since Khrushchev refused to back nuclear escalation, and the durability of American extended deterrence in maritime East Asia. The offshore islands would remain under ROC control without further direct assault.",
    cites: [5, 41] },
  { name: "Sino Indian War", countries: ["China", "India"], region: "East Asia", category: "Armed Conflict", start: 1962, end: 1962, deaths: "~3k", displaced: "~50k",
    note: "The month-long war from **20 October to 21 November 1962** was fought over the disputed boundary in Aksai Chin and the North East Frontier Agency, terrain whose strategic value lay less in its productive capacity than in the road networks that connected Xinjiang and Tibet. Indian forces suffered 1,383 killed against 722 PLA dead, a defeat that exposed the structural weakness of Jawaharlal Nehru's non-aligned defence posture and contributed directly to his political eclipse. **China unilaterally declared a ceasefire** and withdrew north of the McMahon Line while retaining Aksai Chin, an outcome that recurs at every subsequent flashpoint along the Line of Actual Control. The strategic legacy includes Indian nuclear development, the Sino-Pakistani alignment that followed almost immediately, and the contested boundary that produced the Galwan clash of 2020.",
    cites: [1, 5] },
  { name: "Korean DMZ Conflict", countries: ["North Korea", "South Korea"], region: "East Asia", category: "Armed Conflict", start: 1966, end: 1969, deaths: "~700", displaced: "minimal",
    note: "Sometimes termed the **Second Korean War**, the period from 1966 to 1969 saw sustained low-intensity action along and across the Demilitarised Zone, including the January 1968 **Blue House Raid** in which North Korean commandos came within a hundred metres of assassinating President Park Chung-hee and the seizure of the USS Pueblo three days later. American deaths reached 43, ROK soldiers 299, and North Korean infiltrators 397, and the conflict required a substantial increase in the South Korean defence budget at the precise moment when ROK industrial mobilisation was accelerating. The episode demonstrated that the armistice could not contain unconventional warfare, especially as North Korea pursued asymmetric provocation under the cover of nuclear-deterred peace. It also set patterns of crisis management between Seoul and Washington that would recur for decades.",
    cites: [1, 41] },
  { name: "Sino Soviet Border Conflict", countries: ["China", "Soviet Union"], region: "East Asia", category: "Armed Conflict", start: 1969, end: 1969, deaths: "~200", displaced: "minimal",
    note: "Clashes at **Zhenbao Island** on the Ussuri River in March 1969 and at Tielieketi in Xinjiang the following August brought the two largest communist powers to the brink of nuclear war over a doctrinal split that had been brewing since the late 1950s. Soviet contingency planning reportedly considered preemptive strikes on the Chinese nuclear weapons facilities at Lop Nur, and Henry Kissinger later confirmed that Moscow sounded out Washington on its likely response. The crisis was the catalyst for the **Sino-American rapprochement** that ran through Edgar Snow, Kissinger's secret 1971 visit, and Richard Nixon's February 1972 trip to Beijing. It also accelerated Mao's third front industrial dispersal programme, which moved strategic production deep into the interior at enormous economic cost.",
    cites: [1, 41] },
  { name: "Sino Vietnamese War", countries: ["China", "Vietnam"], region: "East Asia", category: "Armed Conflict", start: 1979, end: 1979, deaths: "~30k", displaced: "~250k",
    note: "Deng Xiaoping's intervention from **17 February to 16 March 1979** sought to punish Hanoi for its Soviet alignment and its December 1978 invasion of Cambodia, and to do so without provoking a Soviet response by remaining limited in objective and duration. Chinese sources record 6,954 PLA killed and 14,800 wounded, while Vietnamese sources put PLA dead at 26,000; either way the **PLA's underperformance** against a smaller and lighter Vietnamese force proved diagnostically devastating. Deng used the embarrassment to drive the structural reform of the People's Liberation Army that would consume the next two decades. The conflict also accelerated the exodus of ethnic Chinese from Vietnam, contributing to the boat-people crisis and producing diasporas in Hong Kong, North America, and Australia that endure to this day.",
    cites: [1, 5] },
  { name: "Sino Vietnamese Border Conflicts", countries: ["China", "Vietnam"], region: "East Asia", category: "Armed Conflict", start: 1979, end: 1991, deaths: "~20k", displaced: "minimal",
    note: "After the formal 1979 war ended, the Sino-Vietnamese border remained an active military front for more than a decade, with sustained artillery exchanges and recurrent infantry engagements concentrated around the strategic high ground at **Laoshan** in Yunnan and **Vị Xuyên** in Hà Giang. The longest and bloodiest phase ran from 1984 to 1989, during which the PLA used the front as a rotational combat training ground for units that had not seen action since 1979. Combined casualties across the twelve years approached twenty thousand. Sino-Vietnamese normalisation in 1991 followed the dissolution of the Soviet bloc and the consolidation of Đổi Mới reforms in Hanoi, but the demarcation of the land border was not formally completed until 2008.",
    cites: [1, 41] },
  { name: "Third Taiwan Strait Crisis", countries: ["China", "Taiwan"], region: "East Asia", category: "Armed Conflict", start: 1995, end: 1996, deaths: "minimal", displaced: "minimal",
    note: "From July 1995 through March 1996, the PRC conducted **missile tests and live-fire exercises in waters near Taiwan** aimed at deterring President Lee Teng-hui from his independence-inflected re-election campaign and intimidating Taiwanese voters during the island's first direct presidential election. President Bill Clinton's deployment of the carrier groups led by USS Nimitz and USS Independence to the Taiwan Strait marked the **largest American naval movement in Asia since the Vietnam War** and demonstrated that the United States would risk direct confrontation to protect the island. Lee won decisively, the PRC's coercive signalling backfired politically, and the PLA absorbed the lesson by launching the modernisation programme aimed at developing the anti-access and area-denial capability that has shaped cross-Strait military balance ever since.",
    cites: [5, 41] },
  { name: "China India Galwan Clash", countries: ["China", "India"], region: "East Asia", category: "Armed Conflict", start: 2020, end: 2020, deaths: "~24", displaced: "minimal",
    note: "On **15 June 2020**, soldiers of the PLA and the Indian Army fought a hand-to-hand engagement in the Galwan Valley on the Line of Actual Control, killing twenty Indian soldiers and at least four PLA personnel in the first lethal incident on the contested boundary since 1975. The combatants used clubs, stones, and improvised weapons because of a long-standing bilateral protocol against firearms in the disputed area. The clash triggered a sustained military build-up by both sides along the LAC, accelerated India's strategic re-orientation toward the **Quad** with the United States, Japan, and Australia, and effectively ended the post-1988 framework of management that had treated the boundary as containable. Bilateral disengagement at most friction points was completed only in late 2024.",
    cites: [5, 41] },
  { name: "Fourth Taiwan Strait Crisis", countries: ["China", "Taiwan"], region: "East Asia", category: "Armed Conflict", start: 2022, end: 2022, deaths: "minimal", displaced: "minimal",
    note: "Following **House Speaker Nancy Pelosi's visit to Taiwan on 2 and 3 August 2022**, the PLA conducted live-fire exercises in waters and airspace effectively encircling the island and crossed the median line of the Taiwan Strait in numbers that have since become routine rather than exceptional. The Chinese response, presented as punishment for what Beijing characterised as a violation of the One China principle, established a new operational baseline of permanent military pressure that no subsequent diplomatic exchange has reversed. It also accelerated Taiwan's reorientation of its defence posture toward the **asymmetric** capabilities championed by the late Admiral Lee Hsi-min, the integration of US, Japanese, and Australian planning, and the rebuilding of conscription and reservist training that the island had allowed to atrophy.",
    cites: [5, 41] },
  { name: "Land Reform Campaign", countries: ["China"], region: "East Asia", category: "Political Violence", start: 1947, end: 1953, deaths: "1.5 to 2 M", displaced: "rural class structure dismantled",
    note: "Beginning in liberated areas in the late 1940s and rolled out nationally after 1949, the **Land Reform Campaign** mobilised roughly three hundred million peasants into struggle sessions and people's tribunals that publicly classified rural society into landlords, rich peasants, middle peasants, poor peasants, and labourers, and then liquidated the first category as a social class. Frank Dikötter's *The Tragedy of Liberation* estimates 1.5 to 2 million killed; the Cambridge History of China gives 1 to 2 million; Maurice Meisner's *Mao's China and After* and Philip Short's biography give comparable figures, while Mao himself privately admitted to around 800,000 landlord deaths. The mechanism mattered as much as the toll: the campaign produced denunciation as a routine political practice and generated the **mass political base** on which the Anti-Rightist purge, collectivisation, and the Great Leap Forward would all rest. It also embedded the household class designation that would shape opportunity and risk for individual Chinese families across three generations.",
    cites: [12] },
  { name: "Campaign to Suppress Counterrevolutionaries (Zhenfan)", countries: ["China"], region: "East Asia", category: "Political Violence", start: 1950, end: 1953, deaths: "712k to 2 M+", displaced: "1.29 M imprisoned",
    note: "Launched by Mao's **Double-Ten Directive of 10 October 1950** and intensified after the May 1951 Beijing Conference, the campaign targeted former Kuomintang officials, alleged spies, religious leaders, secret-society members, and any individuals considered politically dangerous to the new regime. Mao set an explicit execution quota of one per thousand of the population, a directive that local cadres applied with varying degrees of literal compliance. Vice-Minister Xu Zirong's January 1954 internal report to the Ministry of Public Security recorded **712,000 executed**, 1.29 million imprisoned, and 1.2 million placed under surveillance; Yang Kuisong's reconsideration in *The China Quarterly* in 2008 treats this as a floor and judges the actual execution count likely much higher, while Dikötter estimates more than two million. The campaign institutionalised **quota-based denunciation** as a tool of governance and inaugurated the laogai system whose operational logic it created.",
    cites: [12, 19] },
  { name: "Anti Rightist Campaign", countries: ["China"], region: "East Asia", category: "Political Violence", start: 1957, end: 1959, deaths: "tens of thousands", displaced: "~550k to 2 M persecuted",
    note: "After the brief liberalisation of the **Hundred Flowers Campaign** in 1956 and early 1957 invited intellectuals to criticise the Party, Mao reversed course in mid-1957 and turned the criticism back on its sources in what may have been a deliberate flushing operation. CCP records published during the late 1970s rectification gave at least 550,000 people politically classified as Rightists; upper estimates reach two million persecuted, with tens of thousands sent to laogai labour camps where many died of overwork and starvation. The campaign decisively **silenced China's intelligentsia** and removed the technocratic voices most likely to have warned Mao against the agricultural fantasies of the coming Great Leap Forward. The lasting institutional effect was the marginalisation of expertise within the Chinese policymaking process for the better part of two decades.",
    cites: [12, 41] },
  { name: "Great Leap Forward Famine", countries: ["China"], region: "East Asia", category: "Political Violence", start: 1958, end: 1962, deaths: "30 to 45 M", displaced: "massive internal",
    note: "Mao's programme to surpass British industrial output within fifteen years collectivised peasants into vast people's communes, diverted agricultural labour to backyard steel production, and imposed inflated grain procurement quotas that local cadres falsified upward in a competitive cascade. The combination produced the **deadliest famine in recorded human history**, an event that is exceptional in its peacetime origin and in the degree to which it was generated by deliberate policy rather than natural shortfall. Judith Banister's 1987 *China's Changing Population* estimated thirty million excess deaths; Yang Jisheng's *Tombstone* gives thirty-six million; **Frank Dikötter's *Mao's Great Famine* reaches forty-five million** and additionally documents that two to three million of those deaths were violent rather than caused by pure starvation. China continued to export grain through the worst years of the famine, and the political logic that produced this outcome was identified internally by Marshal Peng Dehuai, whose dismissal at the 1959 Lushan plenum closed off internal correction and extended the catastrophe by two further years.",
    cites: [10, 11, 13] },
  { name: "Cultural Revolution", countries: ["China"], region: "East Asia", category: "Political Violence", start: 1966, end: 1976, deaths: "1.1 to 1.7 M", displaced: "17 M sent down",
    note: "Mao Zedong launched the **Cultural Revolution in 1966** as a mass mobilisation against perceived capitalist roaders within his own party, using student Red Guards to attack the cultural authority of teachers, officials, and family elders. Andrew Walder's analysis of more than 2,200 county and city annals at Stanford estimates **1.1 to 1.6 million revolution-related deaths** between 1966 and 1971, with the great majority caused by state repression rather than Red Guard factional fighting; two internal CCP investigations from the 1980s gave figures of 1.2 and 1.7 million that broadly corroborate Walder. Yang Su's *Collective Killings in Rural China* documents around three hundred thousand deaths in rural massacres in Guangxi alone. As many as thirty-six million people were persecuted in some way, and approximately seventeen million urban youth were dispatched to the countryside in the Up to the Mountains and Down to the Countryside movement, a generational displacement whose social and intellectual costs continue to shape contemporary Chinese politics.",
    cites: [14, 15] },
  { name: "Tibetan Cultural Revolution Destruction", countries: ["China"], region: "East Asia", category: "Political Violence", start: 1966, end: 1976, deaths: "tens of thousands+", displaced: "cultural infrastructure razed",
    note: "Distinct from the 1950 to 1959 annexation, the Cultural Revolution in Tibet involved the systematic destruction of monastic and cultural infrastructure by Red Guards and Chinese authorities working together with Tibetan revolutionary committees. **More than six thousand of the roughly six thousand two hundred monasteries** standing before 1959 were destroyed or severely damaged across the period, monks were defrocked and sent to laogai camps or to forced agricultural labour, and the **Panchen Lama was imprisoned from 1968 to 1977** after his 1962 petition criticising conditions in Tibet was discovered. Death-toll estimates for Tibetans during the Cultural Revolution period range from tens of thousands to several hundred thousand and are embedded within Walder's broader national figures. The campaign destroyed the institutional bases of Tibetan Buddhist scholarship that would not begin to recover until the partial reconstruction of monasteries from the 1980s onward.",
    cites: [14, 41] },
  { name: "Laogai Forced Labor System", countries: ["China"], region: "East Asia", category: "Political Violence", start: 1949, end: 2026, deaths: "millions cumulative", displaced: "~50 M detained over system history",
    note: "The Chinese **laogai system** ('reform through labour') has operated continuously since 1949, processing political prisoners alongside ordinary criminals through an archipelago of camps whose population at any given time has been estimated by the Laogai Research Foundation at roughly fifty million cumulatively, with deaths in the millions. The system absorbed the surviving victims of the Anti-Rightist Campaign and the Cultural Revolution, formed the institutional precedent for the laojiao 're-education through labour' system that was formally abolished in 2013, and now provides the operational template for the **Xinjiang internment infrastructure** built since 2017. Forced-labour extraction continues in modified form in Xinjiang, Tibet, and certain provincial production chains, and remains a point of contention in international trade policy.",
    cites: [41] },
  { name: "Tiananmen Square Massacre", countries: ["China"], region: "East Asia", category: "Political Violence", start: 1989, end: 1989, deaths: "hundreds to ~10k contested", displaced: "minimal",
    note: "Seven weeks of pro-democracy protests across Beijing and dozens of other Chinese cities, triggered by the **death of reformist general secretary Hu Yaobang on 15 April 1989** and amplified by inflation, official corruption, and a generational opening, were ended by the PLA's 27th and 38th Group Armies on the night of **3 to 4 June 1989**. Most of the killing occurred not in the square itself but along Chang'an Avenue, particularly at Muxidi where the troops first encountered organised civilian resistance. Mainstream scholarly estimates range from several hundred to several thousand dead; the Tiananmen Mothers led by Ding Zilin have verified 202 victims by name as a minimum floor; **declassified British diplomatic cables** released by the UK National Archives in 2017 contain a contemporary minimum estimate of ten thousand civilian dead drawn from a source within the Chinese State Council. The political consequences were decisive: the reformist Zhao Ziyang was purged, the hardline faction consolidated power, and the implicit social bargain that traded political liberalisation for economic growth was reformulated to subordinate the former indefinitely.",
    cites: [6, 7, 41] },
  { name: "Falun Gong Persecution", countries: ["China"], region: "East Asia", category: "Political Violence", start: 1999, end: 2026, deaths: "thousands documented, far higher contested", displaced: "millions detained cumulatively",
    note: "Jiang Zemin banned the spiritual movement on **20 July 1999** after the April 1999 Zhongnanhai sit-in, and Vice-Premier Li Lanqing announced thirty-five thousand detentions in the following four months. The **Independent Tribunal into Forced Organ Harvesting** chaired by Sir Geoffrey Nice KC, the former lead prosecutor of Slobodan Milošević at the ICTY, delivered its Final Judgment on 17 June 2019 finding beyond reasonable doubt that forced organ harvesting from prisoners of conscience has been practiced for a substantial period involving a very substantial number of victims, with Falun Gong practitioners constituting the main source. The Tribunal estimated **sixty thousand to ninety thousand transplant operations annually** in China, far exceeding the volume that the official voluntary donor system could support, and Robertson and Lavee's peer-reviewed analysis in the *American Journal of Transplantation* in 2022 found organ procurement causing death in violation of the dead donor rule. Practitioner-compiled documentation lists thousands of named deaths in custody, a figure that the documenting organisations themselves note is significantly undercounted because of censorship.",
    cites: [35] },
  { name: "Xinjiang Internment and Cultural Repression", countries: ["China"], region: "East Asia", category: "Political Violence", start: 2014, end: 2026, deaths: "uncounted; deaths in custody", displaced: "1 to 1.8 M detained",
    note: "Following the May 2014 Ürümqi attack and Xi Jinping's announcement of the **Strike Hard Campaign**, mass internment infrastructure was rapidly built from 2017, with **Adrian Zenz's** revised November 2019 estimate placing detention at up to 1.8 million Uyghurs and other Turkic Muslims across approximately 1,300 to 1,400 facilities, a figure separately corroborated by the Chinese Human Rights Defenders network. The UN Human Rights Office's August 2022 assessment under Michelle Bachelet found violations that may constitute international crimes, in particular crimes against humanity, and the **United States, United Kingdom Parliament, Canadian House of Commons, and Dutch Parliament have separately designated the campaign as genocide**. Outside the camps, forced sterilisation, family separation through transnational repression and intra-Chinese labour transfers, and pervasive surveillance affect roughly eleven million Uyghurs. The Xinjiang Police Files leak of 2022 added photographs and dossiers of approximately five thousand detainees to the public evidentiary record.",
    cites: [20] },
  { name: "Kwalliso Political Prison Camp System", countries: ["North Korea"], region: "East Asia", category: "Political Violence", start: 1947, end: 2026, deaths: "hundreds of thousands cumulative", displaced: "80k to 120k at any time",
    note: "The Democratic People's Republic of Korea operates a network of total-control political prison camps known as **kwalliso** alongside ordinary penal labour colonies (kyo-hwa-so), holding an estimated eighty thousand to one hundred twenty thousand political prisoners at any given moment per the **UN Commission of Inquiry on Human Rights in the DPRK** report of February 2014. The Commission, chaired by Australian justice Michael Kirby, found that crimes against humanity have been committed pursuant to policies established at the highest level of the state, including extermination, enslavement, torture, prolonged starvation, and the unique practice of three-generation collective punishment under which the spouses, children, and grandchildren of a political offender are detained alongside the offender. Cumulative deaths across the seventy-five year history of the system are estimated in the hundreds of thousands. The COI recommended referral of the DPRK to the International Criminal Court, a course blocked by Chinese and Russian opposition in the Security Council.",
    cites: [36] },
  { name: "North Korean Famine (Arduous March)", countries: ["North Korea"], region: "East Asia", category: "Political Violence", start: 1994, end: 1998, deaths: "600k to 1 M", displaced: "internal economic dislocation",
    note: "Following the death of Kim Il Sung in July 1994, the collapse of Soviet subsidised fuel and fertiliser imports, the floods of 1995 and 1996, and the drought of 1997, North Korea suffered mass starvation that was amplified by central-planning failures and the regime's prioritisation of military rations over civilian distribution. The peer-reviewed demographic study by **Goodkind and West** in *Population and Development Review* in 2001 concluded that famine-related deaths most likely numbered between six hundred thousand and one million, representing three to five percent of the pre-crisis population; Andrei Lankov's analysis in *Foreign Affairs* in 2008 confirms the same range. Higher estimates from Andrew Natsios, the former USAID Administrator, reach two and a half to three and a half million. The famine destroyed the **Public Distribution System** that had been the operational backbone of the North Korean economy and launched the de facto marketisation of jangmadang trading that the regime has since alternately tolerated and tried to suppress.",
    cites: [16, 17] },
  { name: "Jeju 4.3 Uprising and Massacre", countries: ["South Korea"], region: "East Asia", category: "Political Violence", start: 1948, end: 1954, deaths: "14k to 30k", displaced: "230+ villages destroyed",
    note: "Following a small communist-led armed uprising against the planned May 1948 separate elections in southern Korea, the US Military Government in Korea and the subsequent **Syngman Rhee government** conducted a brutal counterinsurgency campaign on Jeju Island that killed an estimated **fourteen thousand to thirty thousand people, roughly one in ten islanders**. The 2003 National Committee for Investigation of the Truth, chaired by Prime Minister Goh Kun, registered 14,373 victims of whom 86 percent were killed by security forces, with the broader Committee estimate at 25,000 to 30,000 and some sources reaching 60,000. President Roh Moo-hyun issued an official apology in October 2003 in what was the first South Korean state apology to the survivors of any Cold War atrocity, and the South Korean police and defence ministry followed in 2019. The Jeju 4.3 Archives were inscribed in UNESCO's Memory of the World register in 2025.",
    cites: [41] },
  { name: "Bodo League Massacre", countries: ["South Korea"], region: "East Asia", category: "Political Violence", start: 1950, end: 1950, deaths: "100k to 200k", displaced: "minimal",
    note: "Following the North Korean invasion on 25 June 1950, President **Syngman Rhee** ordered the execution of members of the National Bodo League, an enrolment list of approximately three hundred thousand alleged former communists, leftists, and political opponents that had been compiled under the cover of an ostensible rehabilitation programme. The Truth and Reconciliation Commissioner Kim Dong-Choon estimates at least one hundred thousand executed; other estimates reach two hundred thousand. The massacres were systematically attributed to North Korean forces by the ROK government and concealed for four decades, with surviving family members threatened under anti-communist national security laws. Mass graves began to be exhumed in the 1990s, and South Korea's **Truth and Reconciliation Commission** formally confirmed the massacre and the state's role in 2009.",
    cites: [41] },
  { name: "Gwangju Uprising and Massacre", countries: ["South Korea"], region: "East Asia", category: "Political Violence", start: 1980, end: 1980, deaths: "200 to 2k", displaced: "minimal",
    note: "After Chun Doo-hwan's December 1979 internal coup and the May 17 1980 expansion of martial law, paratroopers were dispatched to suppress student protests at Chonnam National University and beat protesters with such brutality that the response radicalised the citizens of Gwangju, who armed themselves and **held the city against the regime for six days** from 18 to 27 May 1980. The 20th Division and special-forces paratroopers retook the city on 27 May. Official government figures recorded 191 killed (164 civilians, 23 soldiers, four police), while most scholarly estimates place the toll above one thousand and opposition figures reach two thousand. The uprising catalysed the South Korean democratisation movement that culminated in the direct presidential elections of 1987, and **UNESCO inscribed the May 18 archives** on the Memory of the World register in 2011. Chun Doo-hwan and Roh Tae-woo were later convicted of treason and the Gwangju massacre, then pardoned, and the legal afterlife of the case continues to structure ROK politics.",
    cites: [5, 41] },
  { name: "Taiwan White Terror (228 Incident and Martial Law)", countries: ["Taiwan"], region: "East Asia", category: "Political Violence", start: 1947, end: 1987, deaths: "~18k to 28k (228) + 140k imprisoned", displaced: "~3k to 4k executed",
    note: "On **28 February 1947**, a minor confrontation in Taipei over the seizure of contraband cigarettes by Monopoly Bureau enforcement officers ignited an island-wide uprising against the Kuomintang administration that had taken control after Japanese surrender in 1945, and Chen Yi's nationalist forces responded by sending reinforcements from the mainland and conducting a systematic purge of the Taiwanese political and professional class. The **228 Incident** itself killed an estimated eighteen to twenty-eight thousand people, with the Taiwanese intellectual, legal, and medical elite specifically targeted for elimination in what the Taiwan Transitional Justice Commission has documented through declassified KMT records. The repression then settled into the **thirty-eight-year White Terror** under Chiang Kai-shek and his son Chiang Ching-kuo, the longest period of martial law in modern world history, during which approximately 140,000 people were imprisoned and between three and four thousand were executed for real or imagined political offences. Martial law was lifted only on **15 July 1987**, and the partial release of secret-police files since the 1990s, alongside the establishment of the Transitional Justice Commission in 2018, has begun the slow rehabilitation of victims that mainland-era authoritarianism foreclosed for a generation.",
    cites: [5, 41] },
  { name: "Indonesian National Revolution", countries: ["Indonesia"], region: "Southeast Asia", category: "Armed Conflict", start: 1945, end: 1949, deaths: "~150k", displaced: "~7 M",
    note: "Sukarno proclaimed Indonesian independence on 17 August 1945, two days after the Japanese surrender, and the Dutch attempt to reimpose colonial rule produced a four-year war combining conventional engagements, the diplomatic-military pressure of two large 'police actions' in 1947 and 1948, and a parallel internal struggle over the political character of the new republic. Total deaths from violence and famine reached roughly **one hundred fifty thousand**, with mass displacement of approximately seven million people across the archipelago. American economic pressure on the Netherlands, articulated through threats to Marshall Plan aid, was instrumental in forcing the **Dutch transfer of sovereignty on 27 December 1949**. The unresolved status of West New Guinea and the contested process of state-building in eastern Indonesia laid the groundwork for the Darul Islam revolt and the West Papua conflict that followed.",
    cites: [1, 5] },
  { name: "First Indochina War", countries: ["Vietnam"], region: "Southeast Asia", category: "Armed Conflict", start: 1946, end: 1954, deaths: "~500k", displaced: "~1 M",
    note: "Ho Chi Minh's **declaration of independence on 2 September 1945** and the French attempt at colonial restoration produced eight years of escalating war in which the Viet Minh transformed itself from a guerrilla movement into a conventional military force capable of defeating a Western power. The **defeat at Dien Bien Phu on 7 May 1954**, engineered by Vo Nguyen Giap with Chinese logistical and artillery support, ended French military presence in Indochina and forced the partition agreed at the Geneva Conference of 1954 that divided Vietnam at the 17th parallel pending elections that never took place. Total deaths approached half a million, including substantial Vietnamese civilian losses and approximately ninety-three thousand French Union dead. The settlement seeded the conditions for American escalation that would produce the Second Indochina War.",
    cites: [1, 5] },
  { name: "Hukbalahap Rebellion", countries: ["Philippines"], region: "Southeast Asia", category: "Armed Conflict", start: 1946, end: 1954, deaths: "~25k", displaced: "~500k",
    note: "The **Hukbong Bayan Laban sa mga Hapon (Hukbalahap)**, the wartime peasant army that had fought Japanese occupation in central Luzon, refused to disarm after independence and rebelled against the postwar Roxas government, motivated principally by unaddressed tenancy grievances and the political exclusion of Huk veterans. Defence Secretary and later President **Ramon Magsaysay** combined a counterinsurgency campaign drawing on emerging American doctrine with land reform offers that addressed the underlying grievance, and his Economic Development Corps programme resettled surrendered Huks on Mindanao homesteads. By the mid-1950s the movement was largely defeated, but its surviving cadres provided continuity to the **Communist Party of the Philippines** founded by Jose Maria Sison in 1968 and the NPA insurgency that emerged the following year.",
    cites: [1, 5] },
  { name: "Malayan Emergency", countries: ["Malaysia"], region: "Southeast Asia", category: "Armed Conflict", start: 1948, end: 1960, deaths: "~13k", displaced: "~500k resettled",
    note: "The Malayan Communist Party's armed campaign against the British colonial administration drew on the predominantly ethnic Chinese rural population, whose alienation from the Malay-dominated political settlement created the social base that the insurgency required. The British response under Lieutenant-General **Sir Gerald Templer** combined the political offer of independence, the **Briggs Plan** that forcibly resettled approximately five hundred thousand Chinese squatters into 'New Villages' to sever guerrilla supply, and a counterinsurgency doctrine that emphasised hearts-and-minds work alongside selective violence. The campaign became the canonical Western counterinsurgency case study and informed American doctrine in Vietnam, although the comparison overstates the transferability of conditions specific to peninsular Malaya. Independence followed in 1957 and formal closure of the Emergency in 1960.",
    cites: [1, 5] },
  { name: "Burmese Internal Conflict", countries: ["Myanmar"], region: "Southeast Asia", category: "Armed Conflict", start: 1948, end: 2026, deaths: "230k+ cumulative", displaced: "~3.5 M",
    note: "From independence on **4 January 1948**, the Burmese state has been continuously at war with one or more of the ethnic armed organisations that resist incorporation into the Bamar-dominated central government, including the Karen, Shan, Kachin, Mon, Karenni, Chin, and Wa. The seventy-eight-year conflict has produced more than two hundred thirty thousand cumulative deaths and approximately three and a half million internally displaced people. The 2021 coup against Aung San Suu Kyi's NLD government and the subsequent emergence of the People's Defence Force in alliance with several Ethnic Armed Organisations transformed the conflict from a peripheral counterinsurgency into a multi-front civil war in which the **Tatmadaw** lost effective control of large portions of the country to the post-2023 alliance led by the Three Brotherhood. The trajectory of the war remains the central determinant of Southeast Asia's largest humanitarian crisis.",
    cites: [1, 21, 31] },
  { name: "Darul Islam Rebellion", countries: ["Indonesia"], region: "Southeast Asia", category: "Armed Conflict", start: 1949, end: 1962, deaths: "~30k", displaced: "~500k",
    note: "Sekarmadji Maridjan Kartosuwiryo's proclamation of the **Negara Islam Indonesia (NII)** in August 1949 launched a rebellion against the secular Sukarno government that ran for thirteen years across West Java, South Sulawesi, and Aceh under the banner of establishing an Islamic state. The rebellion was suppressed only through prolonged military operations, and Kartosuwiryo was captured and executed in 1962. The political legacy proved more durable than the military defeat. The NII tradition fed directly into Jemaah Islamiyah and the Bali bombings of 2002, and the unresolved tension between secular state and Islamic identity that the rebellion expressed continues to surface in contemporary Indonesian politics through Hizb ut-Tahrir, the Islamic Defenders Front, and successor formations.",
    cites: [1, 41] },
  { name: "PRRI and Permesta Rebellion", countries: ["Indonesia"], region: "Southeast Asia", category: "Armed Conflict", start: 1958, end: 1961, deaths: "~5k", displaced: "~50k",
    note: "Regional military commanders in Sumatra and Sulawesi declared the **Revolutionary Government of the Republic of Indonesia (PRRI)** and the **Permesta** movement against the Sukarno government in 1958, motivated by Javanese centralisation of economic life, the rising influence of the Communist Party of Indonesia, and the channelling of outer-island commodity revenues into Java. The CIA provided substantial covert support, and the shooting down of pilot Allen Pope over Ambon in May 1958 exposed direct American involvement and effectively ended the covert campaign. The Indonesian army defeated the rebels by 1961 and absorbed many of them into the national military. The episode marked the beginning of the political eclipse of the regional outer-island officer corps and consolidated **Javanese military dominance** of the Indonesian state.",
    cites: [1, 41] },
  { name: "Laotian Civil War", countries: ["Laos"], region: "Southeast Asia", category: "Armed Conflict", start: 1959, end: 1975, deaths: "~50k", displaced: "~750k",
    note: "The three-way contest among the **Pathet Lao**, the Royal Lao Government, and a neutralist faction, fought across sixteen years against the backdrop of the American war in Vietnam, killed approximately fifty thousand Lao and displaced roughly three quarters of a million people. The United States, denied formal intervention by the Geneva Accords of 1962, conducted what was at the time the most intensive aerial bombardment in history, dropping more than two million tonnes of ordnance on Laos and leaving the country with the **per-capita record for unexploded ordnance**, which continues to kill and maim Lao civilians fifty years later. The Pathet Lao victory in December 1975 produced the Lao People's Democratic Republic, the Pathet Lao reeducation campaign for royalists and educated elites, and the Hmong refugee crisis that has continued to shape diaspora communities in the United States, France, and Australia.",
    cites: [1, 5] },
  { name: "Vietnam War (Second Indochina)", countries: ["Vietnam"], region: "Southeast Asia", category: "Armed Conflict", start: 1955, end: 1975, deaths: "~3 M", displaced: "~3 M",
    note: "Dating from the formal North-South partition that the Geneva Accords had intended as provisional, the war combined a southern communist insurgency by the **Viet Cong**, a conventional contest between the People's Army of Vietnam and the Army of the Republic of Vietnam, and an American intervention that escalated from advisers under Eisenhower and Kennedy to a peak of more than five hundred thousand troops under Lyndon Johnson. Total Vietnamese deaths are conventionally estimated at approximately three million, with substantial uncertainty in any individual sub-component. The **Tet Offensive of January 1968** proved politically decisive in shifting American public opinion despite tactical Viet Cong losses. American forces withdrew under the Paris Accords of January 1973, and Saigon fell on **30 April 1975**, producing the reunified Socialist Republic of Vietnam and triggering the Boat People exodus and the reeducation camp system that defined post-1975 Vietnamese politics.",
    cites: [1, 2, 5] },
  { name: "West Papua Conflict", countries: ["Indonesia"], region: "Southeast Asia", category: "Armed Conflict", start: 1963, end: 2026, deaths: "100k+", displaced: "~80k",
    note: "The transfer of Dutch New Guinea to Indonesia in 1963 and the United Nations-supervised but openly manipulated **Act of Free Choice in 1969** placed the Melanesian population of West Papua under Indonesian sovereignty without meaningful consultation. The Free Papua Movement (**Organisasi Papua Merdeka, OPM**) has fought a low-intensity insurgency for the entire intervening period, while Indonesian transmigration policies have shifted the ethnic balance against the indigenous Papuan population. Yale University's Genocide Studies Program has documented patterns of systematic state violence that activist sources characterise as ongoing slow genocide. Cumulative civilian death estimates range from approximately one hundred thousand at the lower scholarly bound to far higher figures that activist groups place above five hundred thousand; the lower figure rests on better documentation.",
    cites: [3, 41] },
  { name: "Konfrontasi", countries: ["Indonesia", "Malaysia"], region: "Southeast Asia", category: "Armed Conflict", start: 1963, end: 1966, deaths: "~600", displaced: "~100k",
    note: "Sukarno's **Konfrontasi** policy opposed the formation of the Federation of Malaysia in 1963 as a neo-colonial construction, and Indonesian forces conducted incursions along the Borneo frontier and into peninsular Malaysia from 1963 to 1966. British Commonwealth forces, including significant Australian and New Zealand contingents, conducted a limited and largely successful counter-campaign. The conflict ended with the **fall of Sukarno** and the consolidation of Suharto's New Order, which abandoned the policy and inaugurated the longest period of regional cooperation in Southeast Asian history through the founding of ASEAN in 1967.",
    cites: [1, 41] },
  { name: "Indonesian Mass Killings", countries: ["Indonesia"], region: "Southeast Asia", category: "Armed Conflict", start: 1965, end: 1966, deaths: "500k to 1 M+", displaced: "~200k",
    note: "Following the failed 30 September 1965 coup attempt attributed to the **PKI (Partai Komunis Indonesia)**, the Indonesian army under Major-General Suharto and allied paramilitary groups, including the Nahdlatul Ulama-affiliated Ansor, conducted mass killings of suspected communists, ethnic Chinese, and various local opponents across Java, Bali, Sumatra, and other islands. Conservative estimates begin at five hundred thousand killed; the most cited figures hover at half a million to one million; some sources reach two to three million. The killings consolidated Suharto's **New Order** that ruled Indonesia for thirty-two years, eliminated the largest non-ruling communist party in the world outside the Soviet bloc, and were facilitated by intelligence cooperation from the United States, the United Kingdom, and Australia that has since been substantially documented through declassified archives. The 2012 Joshua Oppenheimer documentary *The Act of Killing* brought the events into international consciousness in a way that fifty years of Indonesian state silence had prevented.",
    cites: [3, 41] },
  { name: "Communist Insurgency in Thailand", countries: ["Thailand"], region: "Southeast Asia", category: "Armed Conflict", start: 1965, end: 1983, deaths: "~5k", displaced: "minimal",
    note: "The **Communist Party of Thailand**, sustained through the late 1960s and 1970s by sanctuaries in Laos and southern China, conducted a low-intensity insurgency that the Thai military progressively contained through a combination of amnesty programmes, royal village development schemes, and the **rural development doctrine** associated with General Prem Tinsulanonda. The defection of student radicals who had joined the CPT after the **6 October 1976 Thammasat University massacre**, combined with the post-1979 Sino-Vietnamese split that closed Chinese support, produced the movement's terminal decline by 1983. The episode embedded the Thai military and monarchy as joint anti-communist guarantors and shaped the durable lèse-majesté framework that continues to constrain Thai politics.",
    cites: [41] },
  { name: "Cambodian Civil War", countries: ["Cambodia"], region: "Southeast Asia", category: "Armed Conflict", start: 1967, end: 1975, deaths: "~300k", displaced: "~2 M",
    note: "Beginning with the **Samlaut uprising of 1967** that catalysed the Khmer Rouge as an organised force, the civil war intensified after the **18 March 1970 coup** by Lon Nol against Norodom Sihanouk, who then aligned himself with the Khmer Rouge from Beijing exile. American bombing of Cambodia under Operations Menu and Freedom Deal between 1969 and 1973 dropped approximately 2.7 million tonnes of ordnance and produced civilian casualties and rural radicalisation that materially expanded Khmer Rouge recruitment. The Khmer Rouge entered Phnom Penh on **17 April 1975** following the collapse of the Lon Nol government, ending the civil war and beginning the genocidal regime that would consume the next four years.",
    cites: [1, 5] },
  { name: "Second Malayan Insurgency", countries: ["Malaysia"], region: "Southeast Asia", category: "Armed Conflict", start: 1968, end: 1989, deaths: "~600", displaced: "minimal",
    note: "The Malayan Communist Party's residual force, based in southern Thailand under **Chin Peng**, resumed armed activity in 1968 in coordination with the broader Indochinese conflict but never attained the scale of the original Emergency. The campaign was finally settled by the **Hat Yai Peace Accord of 2 December 1989**, signed in southern Thailand, which provided for the demobilisation of the remaining cadres and their formal withdrawal from political activity. The settlement represented an unusually clean conclusion to a Cold War-era insurgency and reflected the broader regional realignment of the late 1980s.",
    cites: [41] },
  { name: "Moro Conflict", countries: ["Philippines"], region: "Southeast Asia", category: "Armed Conflict", start: 1969, end: 2026, deaths: "~120k", displaced: "~500k",
    note: "The Muslim Filipino (**Moro**) population of Mindanao and the Sulu Archipelago, drawing on a distinct historical experience of resistance to Spanish, American, and post-independence Filipino governance, supported successive armed movements beginning with the **Moro National Liberation Front (MNLF)** founded by Nur Misuari in 1972 and continuing through the Moro Islamic Liberation Front (MILF) that split off in 1977. The cumulative death toll has approached one hundred twenty thousand across fifty-seven years. The **2014 Comprehensive Agreement on the Bangsamoro** between the Aquino government and the MILF, followed by the establishment of the Bangsamoro Autonomous Region in 2019, has produced the most substantial peace settlement in the conflict's history, although low-intensity violence and the activity of breakaway factions including elements aligned with Islamic State continue.",
    cites: [3, 41] },
  { name: "NPA Insurgency", countries: ["Philippines"], region: "Southeast Asia", category: "Armed Conflict", start: 1969, end: 2026, deaths: "~40k", displaced: "~250k",
    note: "Founded on 29 March 1969 by **Jose Maria Sison** as the armed wing of the reconstituted Communist Party of the Philippines, the **New People's Army** has conducted one of the longest-running active communist insurgencies in the world. The movement peaked in the mid-1980s with reported strengths of more than twenty-five thousand fighters and operations in roughly half of the country's provinces, but factional splits, the Cold War's end, and successive Philippine government counterinsurgency campaigns have since reduced its operational scale substantially. Sison himself died in exile in the Netherlands in December 2022. The conflict's longevity reflects the persistence of the agrarian-class grievances and elite political structures that the original CPP analysis identified, more than the continued ideological appeal of Maoism.",
    cites: [3, 41] },
  { name: "Khmer Rouge Regime", countries: ["Cambodia"], region: "Southeast Asia", category: "Armed Conflict", start: 1975, end: 1979, deaths: "~1.7 to 2.2 M", displaced: "~600k refugees",
    note: "Pol Pot's **Khmer Rouge** entered Phnom Penh on 17 April 1975 and immediately began the most demographically catastrophic political regime of the second half of the twentieth century, evacuating cities, abolishing money, and pursuing the agrarian communist utopia outlined in the **Four Year Plan**. Within four years, approximately 1.7 to 2.2 million Cambodians died of execution, starvation, disease, and overwork, including roughly half of the urban and ethnic Chinese populations and most of the educated professional class. Internal purges within the regime, particularly the Eastern Zone purges of 1977 to 1978 that killed an estimated one hundred to two hundred fifty thousand cadres and civilians, foreshadowed the dynamic that drove the **Vietnamese invasion of December 1978** and the regime's collapse on 7 January 1979. The Extraordinary Chambers in the Courts of Cambodia have since convicted senior leaders Nuon Chea, Khieu Samphan, and Kaing Guek Eav (Duch) of genocide and crimes against humanity.",
    cites: [1, 5] },
  { name: "East Timor Occupation", countries: ["Indonesia", "Timor-Leste"], region: "Southeast Asia", category: "Armed Conflict", start: 1975, end: 1999, deaths: "100k to 180k", displaced: "~250k",
    note: "Following the Portuguese withdrawal in 1975 and a brief civil war among Timorese factions, Indonesia invaded East Timor on **7 December 1975** with American and Australian acquiescence under the cover of anti-communist containment. The **Commission for Reception, Truth and Reconciliation (CAVR)** final report in 2005 documented approximately 102,800 conflict-related deaths, with the great majority caused by hunger and illness during the encirclement and resettlement campaigns of 1977 to 1979; broader estimates reach 180,000. The **August 1999 referendum** under UN supervision produced an overwhelming vote for independence, after which Indonesian-organised militia attacks destroyed much of the country's infrastructure before INTERFET intervention restored order. East Timor became independent as Timor-Leste on **20 May 2002**.",
    cites: [22, 41] },
  { name: "Aceh Insurgency", countries: ["Indonesia"], region: "Southeast Asia", category: "Armed Conflict", start: 1976, end: 2005, deaths: "~15k", displaced: "~500k",
    note: "Hasan di Tiro's proclamation of an independent Aceh on **4 December 1976** initiated a thirty-year insurgency rooted in Acehnese historical autonomy, grievances over the distribution of Aceh's natural gas revenue, and the **DOM (Daerah Operasi Militer)** military operations zone designation that produced systematic Indonesian army abuses through the 1990s. The **2004 Indian Ocean tsunami**, which killed approximately one hundred seventy thousand people in Aceh alone, created the political conditions for the **August 2005 Helsinki Memorandum of Understanding** brokered by former Finnish president Martti Ahtisaari between the Indonesian government and the **Free Aceh Movement (GAM)**. The settlement produced substantial autonomy for Aceh, including the partial application of Sharia law, and ended one of Southeast Asia's longest-running ethnonationalist conflicts.",
    cites: [3, 41] },
  { name: "Cambodian Vietnamese War", countries: ["Cambodia", "Vietnam"], region: "Southeast Asia", category: "Armed Conflict", start: 1978, end: 1989, deaths: "~100k", displaced: "~600k",
    note: "Vietnam's **invasion of Khmer Rouge Cambodia on 25 December 1978**, prompted by sustained Khmer Rouge cross-border raids and internal purges of the pro-Vietnamese faction within the Cambodian party, removed Pol Pot's regime within two weeks and installed the **People's Republic of Kampuchea** under Heng Samrin and later Hun Sen. The subsequent decade saw Vietnamese forces occupying Cambodia while a Khmer Rouge guerrilla resistance operated from Thai border camps with Chinese and tacit Western support that took the form of continued recognition of the Khmer Rouge as Cambodia's UN representative. Vietnamese withdrawal in **September 1989** preceded the Paris Peace Accords of 1991 and the UN-supervised elections of 1993 that established the **constitutional monarchy** under which Hun Sen consolidated subsequent personal rule.",
    cites: [1, 5] },
  { name: "Thai Laotian Border War", countries: ["Thailand", "Laos"], region: "Southeast Asia", category: "Armed Conflict", start: 1987, end: 1988, deaths: "~1k", displaced: "minimal",
    note: "Sometimes called the **Romklao Battle** or the Ban Romklao Border War, the brief conflict between Thailand and Laos over disputed territory along the Heuang River in the central Lao border area killed approximately one thousand combatants in three months of fighting from December 1987 to February 1988. Thai forces, supported by armour and air strikes, took heavier casualties than expected against Vietnamese-backed Lao defenders. The ceasefire, mediated through ASEAN diplomatic channels, restored the status quo without resolving the underlying boundary dispute, which was settled only decades later through a Joint Boundary Commission.",
    cites: [41] },
  { name: "Maluku Sectarian Conflict", countries: ["Indonesia"], region: "Southeast Asia", category: "Armed Conflict", start: 1999, end: 2002, deaths: "~5k", displaced: "~500k",
    note: "Beginning with communal clashes on **19 January 1999** in Ambon, the Maluku sectarian conflict pitted Christian Ambonese against Muslim Ambonese and Bugis-Makassar migrants in a three-year cycle of violence amplified by the post-Suharto institutional collapse and by the arrival of the Java-based **Laskar Jihad** paramilitary group from 2000 onward. Approximately five thousand people were killed and half a million displaced before the **Malino II Accord of February 2002** ended the major fighting. The conflict accelerated the regional decentralisation reforms of the Megawati Sukarnoputri government and provided the operational testing ground for Islamist networks that would later contribute to Jemaah Islamiyah's regional activities.",
    cites: [3, 41] },
  { name: "Southern Thailand Insurgency", countries: ["Thailand"], region: "Southeast Asia", category: "Armed Conflict", start: 2004, end: 2026, deaths: "~7k", displaced: "~100k",
    note: "Re-emerging in January 2004 in the Malay-Muslim majority southernmost provinces of **Pattani, Yala, and Narathiwat**, the contemporary phase of the southern Thai insurgency builds on a multi-decade grievance with roots in the 1909 Anglo-Siamese Treaty that incorporated the historic Malay sultanate of Pattani into the Thai state. The cumulative toll across twenty-two years has approached seven thousand deaths, with the principal active groups including the **Barisan Revolusi Nasional (BRN)** and a constellation of smaller formations. Successive Thai governments have alternated between negotiation tracks and security crackdowns; the conflict has not produced the regional spillover that observers anticipated in the mid-2000s, but neither has it admitted of a political settlement comparable to that achieved in the Philippine Bangsamoro.",
    cites: [3, 41] },
  { name: "Myanmar Rohingya Crisis", countries: ["Myanmar"], region: "Southeast Asia", category: "Armed Conflict", start: 2016, end: 2017, deaths: "25k+", displaced: "~900k",
    note: "Following Arakan Rohingya Salvation Army attacks on Myanmar Border Guard police posts in October 2016 and August 2017, the Tatmadaw conducted **clearance operations in northern Rakhine State** that the **UN Independent Fact-Finding Mission on Myanmar** in its September 2018 report characterised as bearing the hallmarks of genocide. Médecins Sans Frontières estimated at least 6,700 Rohingya killed in the first month alone and total deaths exceeding ten thousand; approximately 740,000 Rohingya fled to Bangladesh, joining an existing refugee population to form the world's largest refugee camp complex at **Cox's Bazar**. The Gambia filed a genocide case at the International Court of Justice in 2019 under the Genocide Convention; the case remains active.",
    cites: [4, 21] },
  { name: "Myanmar Post Coup Civil War", countries: ["Myanmar"], region: "Southeast Asia", category: "Armed Conflict", start: 2021, end: 2026, deaths: "~90k", displaced: "~3.5 M",
    note: "The Tatmadaw coup of **1 February 2021** removed Aung San Suu Kyi's National League for Democracy government and produced an armed resistance combining the **People's Defence Force** raised under the National Unity Government and a tactical alliance with several Ethnic Armed Organisations. The **2023 Operation 1027 offensive** by the Three Brotherhood Alliance (Myanmar National Democratic Alliance Army, Arakan Army, and Ta'ang National Liberation Army) seized substantial territory from the Tatmadaw and represented the most significant battlefield reverse for the Myanmar military in its modern history. The Assistance Association for Political Prisoners has documented more than six thousand three hundred killings and more than twenty-eight thousand political arrests; the displacement total exceeds three and a half million people.",
    cites: [4, 31] },
  { name: "Thai Cambodian Border Crisis", countries: ["Thailand", "Cambodia"], region: "Southeast Asia", category: "Armed Conflict", start: 2025, end: 2026, deaths: "149+", displaced: "~750k",
    note: "A sustained border crisis between Thailand and Cambodia centred on the disputed **Preah Vihear temple zone** and adjacent contested terrain produced at least 149 deaths and approximately 750,000 displaced civilians across both sides of the frontier between mid-2025 and early 2026. The episode marks the most serious bilateral military confrontation since the 2011 Preah Vihear clashes, and reflects both the unresolved cartographic legacy of the 1907 Franco-Siamese Treaty and the domestic political utility of the dispute to both governments. ASEAN-mediated **ceasefire arrangements brokered in December 2025** stabilised but did not resolve the situation.",
    cites: [32] },
  { name: "Vietnamese Reeducation Camps", countries: ["Vietnam"], region: "Southeast Asia", category: "Political Violence", start: 1975, end: 1992, deaths: "~50k to 150k", displaced: "500k to 1 M detained",
    note: "Following the fall of Saigon on 30 April 1975, the Socialist Republic of Vietnam interned an estimated half a million to one million **former South Vietnamese officers, civil servants, religious figures, professionals, and intellectuals** in the trại cải tạo (\"reeducation camps\"), an institutional system that observers have termed the **Bamboo Gulag**. Inmates faced indeterminate sentences without trial, forced labour, malnutrition, political indoctrination, and torture; estimated deaths in custody range from fifty thousand to one hundred fifty thousand across the seventeen years of the system's operation. The camp population produced the second wave of the **Boat People exodus** as released prisoners and their families fled by sea, with combined departures and at-sea deaths shaping the Vietnamese diasporas of the United States, Canada, France, and Australia. The system formally closed in 1992 under negotiations linked to American normalisation and the Humanitarian Operation programme.",
    cites: [41] },
  { name: "New Economic Zones Program", countries: ["Vietnam"], region: "Southeast Asia", category: "Political Violence", start: 1975, end: 1985, deaths: "tens of thousands (incl. boat people)", displaced: "~1 M relocated",
    note: "The **New Economic Zones programme** forcibly relocated approximately one million urban southerners, particularly those associated with the former Republic of Vietnam government and ethnic Chinese (Hoa) merchant families, to marginal agricultural lands in the highlands and along the Cambodian border. The combination of dispossession, the New Economic Zones, the 1978 currency reform that eliminated southern savings, and ethnic Chinese exclusion drove approximately eight hundred thousand departures by sea between 1975 and 1995, including a refugee outflow that peaked dramatically with the simultaneous Sino-Vietnamese War and the broader pressure on Chinese-Vietnamese communities in 1979. Tens of thousands died at sea or in piracy-affected waters off Thailand and Malaysia, producing the iconic imagery of the **Boat People crisis** and the post-Vietnam War humanitarian protocols that still shape international refugee response.",
    cites: [41] },
  { name: "Laotian Reeducation and Hmong Persecution", countries: ["Laos"], region: "Southeast Asia", category: "Political Violence", start: 1975, end: 2026, deaths: "tens of thousands cumulative", displaced: "~300k Hmong refugees",
    note: "Following the December 1975 Pathet Lao takeover, the new government interned approximately thirty thousand royalist officials, military officers, and educated elites in **samana (\"seminar\") camps**, where some were held for more than a decade. Concurrently, **Hmong communities that had supported the US covert war** during the Laotian Civil War faced systematic military operations, including credible allegations of chemical weapons use in the late 1970s and early 1980s associated with the **yellow rain** controversy. Hundreds of thousands of Hmong fled to Thailand, and the refugee resettlement that followed produced the substantial Hmong diaspora in Minnesota, Wisconsin, California, and France. Targeted military operations against remaining Hmong resistance in Xaisomboun Province continued sporadically into the 2000s, and the cumulative death toll from post-1975 persecution is estimated in the tens of thousands.",
    cites: [41] },
  { name: "Burmese Junta Political Repression", countries: ["Myanmar"], region: "Southeast Asia", category: "Political Violence", start: 1962, end: 2026, deaths: "13k+ documented", displaced: "tens of thousands detained",
    note: "Successive Burmese military regimes from the **Ne Win era beginning in 1962** through the SLORC and SPDC periods (1988 to 2011) and the renewed Tatmadaw rule after the 2021 coup have engaged in systematic political imprisonment, torture, and killing of dissidents, monks, ethnic activists, journalists, and democracy organisers. The **8888 Uprising suppression** in August 1988 killed an estimated three thousand to ten thousand, the September 2007 **Saffron Revolution** suppression killed at least dozens and likely several hundred, and the post-2021 repression has produced more than six thousand three hundred confirmed killings and more than twenty-eight thousand political arrests documented by the Assistance Association for Political Prisoners. The state-civilian violence overlays the ethnic-conflict toll documented separately under the Burmese Internal Conflict entry.",
    cites: [21] },
  { name: "First Indo Pakistani War", countries: ["India", "Pakistan"], region: "South Asia", category: "Armed Conflict", start: 1947, end: 1948, deaths: "~8k", displaced: "~500k Kashmir",
    note: "Following the **accession of Maharaja Hari Singh of Jammu and Kashmir to India on 26 October 1947** under the pressure of Pakistani tribal raiders advancing on Srinagar, Indian and Pakistani regular forces fought a fifteen-month war that established the **Line of Control** roughly along the front lines as they stood at the UN-brokered ceasefire of 1 January 1949. The war killed approximately eight thousand combatants and displaced about half a million Kashmiris on both sides of the new line. The unresolved political status of Kashmir, the absence of the promised plebiscite, and the ambiguous sovereignty of the territory have shaped every subsequent India-Pakistan crisis, including the wars of 1965 and 1999 and the chronic insurgency that began in 1989.",
    cites: [1, 5] },
  { name: "Annexation of Hyderabad", countries: ["India"], region: "South Asia", category: "Armed Conflict", start: 1948, end: 1948, deaths: "~30k+", displaced: "~100k",
    note: "**Operation Polo**, conducted by the Indian Army from 13 to 18 September 1948, ended the independent existence of the princely state of Hyderabad, whose Muslim ruler Mir Osman Ali Khan had attempted to preserve sovereign status separate from both India and Pakistan. The military operation took five days. The **Sundarlal Committee report**, commissioned by Nehru but suppressed until 2013, found that between twenty-seven thousand and forty thousand Muslims were killed in communal violence in Hyderabad in the months that followed the formal annexation, principally at the hands of local Hindu militants with at least passive Indian Army acquiescence. The episode established the precedent for the forceful incorporation of holdout princely states and complicated subsequent communal politics in the Telangana region.",
    cites: [1, 41] },
  { name: "Northeast India Insurgencies", countries: ["India"], region: "South Asia", category: "Armed Conflict", start: 1954, end: 2026, deaths: "~25k cumulative", displaced: "~150k",
    note: "The complex of insurgencies in **Nagaland, Manipur, Mizoram, Assam, Meghalaya, and Tripura** has produced approximately twenty-five thousand cumulative deaths across seventy-two years, with active phases varying substantially across the seven states. The **Naga insurgency** dating from 1954, the **Mizo insurgency** of 1966 to 1986 ended by the Mizoram Accord, the **United Liberation Front of Asom (ULFA)** active since 1979, and the various Manipuri valley-based movements share grievances rooted in the political incorporation of the historically distinct northeast into the Indian republic, the migration pressures from Bangladesh, and the **Armed Forces Special Powers Act** of 1958 that has structured the security response. Several formations have signed peace accords; others remain active in reduced form.",
    cites: [1, 41] },
  { name: "Annexation of Goa", countries: ["India"], region: "South Asia", category: "Armed Conflict", start: 1961, end: 1961, deaths: "~50", displaced: "minimal",
    note: "**Operation Vijay** ended Portuguese rule in Goa, Daman, and Diu in 36 hours of fighting from 18 to 19 December 1961, with approximately fifty combatant deaths split between Indian and Portuguese forces. The action was politically controversial internationally and produced a Security Council debate in which the Soviet veto blocked a Western-backed resolution against Indian use of force, but it consolidated the Indian principle that the **decolonisation of European enclaves** in the subcontinent was a domestic matter rather than an issue of international law. The integration of the Goan economy and political system into Indian federalism proceeded rapidly, and Goa achieved full statehood within India in 1987.",
    cites: [5, 41] },
  { name: "Second Indo Pakistani War", countries: ["India", "Pakistan"], region: "South Asia", category: "Armed Conflict", start: 1965, end: 1965, deaths: "~7k", displaced: "~50k",
    note: "Triggered by Pakistan's **Operation Gibraltar**, an attempt to infiltrate irregular forces into Indian-administered Kashmir to ignite an uprising, the war expanded into a brief but intense conventional conflict involving the largest tank battles since the Second World War in the Khem Karan and Chawinda sectors. Combined deaths approached seven thousand. The **Tashkent Declaration of January 1966**, mediated by Soviet Premier Alexei Kosygin between Lal Bahadur Shastri and Ayub Khan, restored the pre-war frontiers without resolving the Kashmir question. Shastri died of a heart attack the night the agreement was signed.",
    cites: [1, 5] },
  { name: "Naxalite Maoist Insurgency", countries: ["India"], region: "South Asia", category: "Armed Conflict", start: 1967, end: 2026, deaths: "~15k cumulative", displaced: "~300k",
    note: "The peasant uprising at **Naxalbari in West Bengal** in May 1967 gave its name to the diffuse Indian Maoist movement that has operated continuously for nearly six decades across the forested tribal belt running from Andhra Pradesh through Chhattisgarh, Jharkhand, Odisha, and Bihar. The unified **Communist Party of India (Maoist)** founded in 2004 absorbed the surviving regional factions and reached a peak operational scale around 2010, when Prime Minister Manmohan Singh described the movement as 'the single biggest internal security challenge ever faced by our country.' Indian Operation **SAMADHAN** and successive state-level pacification campaigns have substantially reduced the geographic spread of active operations since approximately 2015, although the underlying issues of tribal land rights, mineral resource extraction, and rural marginalisation that the movement addresses remain largely unresolved.",
    cites: [3, 41] },
  { name: "Bangladesh Liberation War", countries: ["Bangladesh", "Pakistan", "India"], region: "South Asia", category: "Armed Conflict", start: 1971, end: 1971, deaths: "300k to 3 M", displaced: "~10 M to India",
    note: "Following the **March 1971 launch of Operation Searchlight** by the Pakistani military government of General Yahya Khan against the Awami League-led Bengali nationalist movement that had won the December 1970 elections, the Pakistan Army conducted what the Bangladeshi state characterises as a genocide and what scholars including Sarmila Bose and others characterise more variably. The death toll is extraordinarily contested: the Bangladeshi government's figure of three million is at the upper bound, while peer-reviewed analysis by **Rahman and colleagues in *PLOS One*** in 2025 supports a far lower figure of approximately three hundred thousand. Approximately ten million Bengali refugees fled to India, prompting **Indian military intervention in December 1971** that ended the war in thirteen days with the surrender of ninety-three thousand Pakistani troops in Dhaka on 16 December 1971 and the establishment of the independent state of Bangladesh.",
    cites: [1, 39, 41] },
  { name: "Soviet Afghan War", countries: ["Afghanistan", "Soviet Union"], region: "South Asia", category: "Armed Conflict", start: 1979, end: 1989, deaths: "1 to 2 M", displaced: "~6 M",
    note: "The **Soviet intervention from 24 December 1979** to support the Karmal-Najibullah PDPA government against the Islamist mujahideen produced nine years of war that killed between one and two million Afghans and displaced approximately six million, of whom roughly three million each settled in Pakistan and Iran. American, Saudi, and Pakistani support for the mujahideen, channelled through the **CIA and ISI** under Operation Cyclone, peaked at over six hundred million dollars annually by the late 1980s, with Stinger missiles transforming the air-defence balance from 1986. The **Geneva Accords of April 1988** provided for Soviet withdrawal completed on 15 February 1989, but the war's afterlife structured the subsequent Afghan Civil War, the Taliban rise, and the global jihadist networks whose American consequences materialised on 11 September 2001.",
    cites: [1, 5] },
  { name: "Sri Lankan Civil War", countries: ["Sri Lanka"], region: "South Asia", category: "Armed Conflict", start: 1983, end: 2009, deaths: "~100k", displaced: "~800k",
    note: "The **anti-Tamil pogrom of July 1983**, commonly called **Black July**, killed approximately three thousand Tamils in Colombo and other cities and consolidated the Liberation Tigers of Tamil Eelam (**LTTE**) under Velupillai Prabhakaran as the dominant armed expression of Tamil grievance against the Sinhala-majoritarian state. The war's twenty-six year duration produced one hundred thousand deaths, eight hundred thousand displaced, and the operational innovation of the suicide-bomber 'Black Tiger' programme. The final phase from January to **18 May 2009** ended the LTTE militarily through a series of operations that the UN Panel of Experts found to have included credible evidence of war crimes by both sides; the Sri Lankan state and the LTTE leadership both bear distinct responsibility for the conduct of the war's closing months.",
    cites: [1, 23] },
  { name: "Punjab Khalistan Insurgency", countries: ["India"], region: "South Asia", category: "Armed Conflict", start: 1984, end: 1995, deaths: "~25k", displaced: "~70k",
    note: "The Sikh nationalist insurgency demanding the independent state of **Khalistan** intensified after **Operation Blue Star** in June 1984, in which the Indian Army stormed the Golden Temple complex in Amritsar to remove the militant leader Jarnail Singh Bhindranwale, killing hundreds of pilgrims and combatants in the process. The October 1984 **assassination of Prime Minister Indira Gandhi** by two of her Sikh bodyguards triggered the anti-Sikh pogrom catalogued separately. The eleven-year insurgency was suppressed by 1995 through a combination of Punjab Police operations under K. P. S. Gill, mass disappearances, and the political settlement that returned power to a Sikh-majority elected state government. Approximately twenty-five thousand were killed; the conflict's legacy continues to surface in international Sikh diaspora politics, including the 2023 Canada-India crisis over the killing of Hardeep Singh Nijjar.",
    cites: [3, 41] },
  { name: "Indian Peace Keeping Force in Sri Lanka", countries: ["Sri Lanka", "India"], region: "South Asia", category: "Armed Conflict", start: 1987, end: 1990, deaths: "~5k", displaced: "subsumed in Sri Lankan war",
    note: "The **Indo-Sri Lanka Accord of 29 July 1987** between Rajiv Gandhi and Junius Jayewardene introduced the Indian Peace Keeping Force (**IPKF**) to disarm the LTTE and implement the political devolution package agreed under the Accord. The mission failed comprehensively: the LTTE refused to disarm, the Sri Lankan state revoked its consent for Indian presence under Ranasinghe Premadasa, and the IPKF withdrew in March 1990 having lost approximately twelve hundred soldiers and inflicted comparable Tamil civilian casualties. The episode produced the **assassination of Rajiv Gandhi by an LTTE suicide bomber on 21 May 1991**, the only foreign head of government ever killed by the LTTE, and lastingly soured Indian appetite for direct military intervention in regional conflicts.",
    cites: [3, 41] },
  { name: "Maldives Coup Attempt", countries: ["Maldives", "India"], region: "South Asia", category: "Armed Conflict", start: 1988, end: 1988, deaths: "~20", displaced: "minimal",
    note: "The **3 November 1988 coup attempt** by approximately eighty mercenaries of the Sri Lankan Tamil PLOTE faction, hired by exiled Maldivian businessman Abdullah Luthufi, was defeated within hours by an Indian military intervention authorised by Prime Minister Rajiv Gandhi under **Operation Cactus**. Indian paratroopers airlifted to Malé via Trivandrum secured the airport and the presidential palace, restoring Maumoon Abdul Gayoom to power. The episode demonstrated the value of the Indian security guarantee for the Maldives and consolidated the bilateral defence relationship that has since shaped strategic competition with China for influence in the Indian Ocean island states.",
    cites: [41] },
  { name: "Kashmir Insurgency", countries: ["India", "Pakistan"], region: "South Asia", category: "Armed Conflict", start: 1989, end: 2026, deaths: "~50k", displaced: "~250k",
    note: "The Kashmir insurgency that began in 1989 emerged from a combination of disputed state elections in 1987, the demographic and political effects of the Afghan jihad next door, and the long-running grievances over the unresolved political status of the Jammu and Kashmir state. Approximately fifty thousand have been killed across thirty-seven years, including substantial militant, security, and civilian losses, and roughly two hundred fifty thousand Kashmiri Pandits were displaced from the Valley in 1990 in what they characterise as ethnic cleansing. The **5 August 2019 revocation of Article 370** and the bifurcation of the state into the Union Territories of Jammu and Kashmir and Ladakh transformed the political framework of the dispute, and tensions with Pakistan persisted through to the 2025 Operation Sindoor crisis.",
    cites: [3, 41] },
  { name: "Afghan Civil War (Post Soviet)", countries: ["Afghanistan"], region: "South Asia", category: "Armed Conflict", start: 1989, end: 1996, deaths: "~400k", displaced: "~3 M",
    note: "Following the Soviet withdrawal in February 1989 and the eventual collapse of the **Najibullah government** in April 1992, the mujahideen factions that had united against the PDPA fractured along ethnic and personal lines into the multi-sided civil war fought primarily in Kabul and the major provincial capitals. The destruction of central Kabul during the 1992 to 1996 period was substantially greater than that suffered during the Soviet period itself, with sustained artillery exchanges between **Ahmad Shah Massoud's** Jamiat-e Islami, Gulbuddin Hekmatyar's Hezb-e Islami, and the Hazara Hezb-e Wahdat forces. The Taliban emerged from the southern Pashtun belt in 1994 and entered Kabul on **27 September 1996**, ending the civil war's first phase and inaugurating the regime that would govern most of Afghanistan until 2001.",
    cites: [1, 5] },
  { name: "Lhotshampa Expulsion (Bhutan)", countries: ["Bhutan", "Nepal"], region: "South Asia", category: "Armed Conflict", start: 1990, end: 1992, deaths: "~100", displaced: "~100k",
    note: "The Bhutanese government under King Jigme Singye Wangchuck enacted **citizenship and cultural homogenisation policies** through the 1985 Citizenship Act and the 1989 Driglam Namzha code that effectively redefined as illegal residents much of the Lhotshampa population, the ethnic Nepali Hindu community settled in southern Bhutan since the late nineteenth century. The expulsion of approximately one hundred thousand Lhotshampas to refugee camps in southeastern Nepal between 1990 and 1992 constituted one of the highest per-capita refugee outflows of any country in the late twentieth century. After two decades in the camps, a substantial proportion of the population was resettled to the United States, Canada, Australia, Norway, and the United Kingdom under a programme launched in 2007, while the small remaining population continues to seek bilateral repatriation that Thimphu has not facilitated.",
    cites: [4, 41] },
  { name: "Nepalese Civil War", countries: ["Nepal"], region: "South Asia", category: "Armed Conflict", start: 1996, end: 2006, deaths: "~17k", displaced: "~200k",
    note: "The **Communist Party of Nepal (Maoist)** launched its 'People's War' on 13 February 1996 from base areas in the mid-western hills, drawing on the social mobilisation of marginalised caste and ethnic groups and the institutional weakness of the constitutional monarchy. The conflict killed approximately seventeen thousand across ten years and culminated in the November 2006 **Comprehensive Peace Agreement** that ended the war, abolished the monarchy in 2008, and integrated the Maoists into electoral politics. The 1 June 2001 **palace massacre** in which Crown Prince Dipendra killed King Birendra and most of the royal family had created the immediate political conditions for the unpopular accession of King Gyanendra, whose 2005 royal coup catalysed the broader political alliance that delivered the eventual settlement.",
    cites: [1, 41] },
  { name: "Afghan Civil War (Taliban Northern Alliance)", countries: ["Afghanistan"], region: "South Asia", category: "Armed Conflict", start: 1996, end: 2001, deaths: "~50k", displaced: "~1 M",
    note: "Following the **Taliban capture of Kabul on 27 September 1996**, the surviving non-Pashtun mujahideen factions consolidated as the **United Islamic Front for the Salvation of Afghanistan (Northern Alliance)** under Ahmad Shah Massoud, controlling primarily the northeastern provinces from Badakhshan to Panjshir. The five-year civil war featured the destruction of the Bamiyan Buddhas in March 2001, systematic Taliban atrocities against the Hazara population, the al-Qaeda relationship that produced the embassy bombings of 1998 and the **11 September 2001 attacks**, and the **assassination of Massoud on 9 September 2001** by al-Qaeda agents posing as journalists. The American intervention that began on 7 October 2001 ended this phase by toppling the Taliban government within two months.",
    cites: [1, 5] },
  { name: "Kargil War", countries: ["India", "Pakistan"], region: "South Asia", category: "Armed Conflict", start: 1999, end: 1999, deaths: "~1.3k", displaced: "~50k",
    note: "Pakistani Army troops disguised as Kashmiri militants occupied dominating positions in the **Kargil sector of the Line of Control** during the winter of 1998 to 1999, intending to interdict the Srinagar to Leh national highway and present India with a fait accompli. The Indian Army's recapture of the positions through high-altitude infantry assaults during May to July 1999, including the iconic battles at Tololing and Tiger Hill, produced approximately thirteen hundred combined combatant deaths. The crisis was the first conventional war between two declared nuclear powers and prompted **American mediation under President Clinton** that forced Prime Minister Nawaz Sharif to order Pakistani withdrawal, the political fallout of which contributed to General Pervez Musharraf's October 1999 coup.",
    cites: [1, 5] },
  { name: "United States War in Afghanistan", countries: ["Afghanistan"], region: "South Asia", category: "Armed Conflict", start: 2001, end: 2021, deaths: "~240k", displaced: "~5 M",
    note: "**Operation Enduring Freedom** began on 7 October 2001 in response to the 11 September attacks and the Taliban's refusal to surrender al-Qaeda's leadership, and rapidly toppled the Taliban government in collaboration with the Northern Alliance. The subsequent twenty-year war of state-building and counterinsurgency killed approximately two hundred forty thousand people across Afghanistan and Pakistan per Brown University's **Costs of War project**, displaced approximately five million Afghans, and consumed direct American expenditure exceeding two trillion dollars. The **Doha Agreement of February 2020** between the Trump administration and the Taliban set the terms for American withdrawal, and the rapid Taliban reconquest of Kabul on **15 August 2021** ended the longest war in American history and produced the chaotic evacuation that defined the war's closing image.",
    cites: [9, 41] },
  { name: "War in Northwest Pakistan", countries: ["Pakistan"], region: "South Asia", category: "Armed Conflict", start: 2004, end: 2026, deaths: "~80k", displaced: "~3 M",
    note: "Pakistani military operations in the **Federally Administered Tribal Areas (FATA)** since 2004 have targeted the Tehrik-i-Taliban Pakistan (TTP), al-Qaeda affiliates, and various Punjabi Taliban formations that had taken sanctuary in the tribal districts. The conflict's death toll across twenty-two years has approached eighty thousand, including substantial civilian casualties from drone strikes, military operations, and TTP terrorism. The 2014 **Peshawar Army Public School massacre** in which TTP gunmen killed 149 people, mostly children, catalysed the comprehensive military **Operation Zarb-e-Azb** and the **National Action Plan**, and the 2018 constitutional merger of FATA into Khyber Pakhtunkhwa formalised the end of the colonial-era tribal administrative regime. The conflict has resurged since 2021 alongside the Afghan Taliban's return to power.",
    cites: [3, 9] },
  { name: "Balochistan Insurgency", countries: ["Pakistan"], region: "South Asia", category: "Armed Conflict", start: 2004, end: 2026, deaths: "~15k", displaced: "~100k",
    note: "The fifth and ongoing phase of Baloch nationalist insurgency against the Pakistani state, dating from the 2004 mobilisation of the **Baloch Liberation Army** and successor groups including the Baloch Liberation Front and the Baloch Republican Army, has killed approximately fifteen thousand people across twenty-two years. The conflict combines longstanding grievances over the distribution of Balochistan's natural resource revenues, the demographic effects of Punjabi and Pashtun settlement, and the geostrategic role of the **China-Pakistan Economic Corridor** that runs through the province and that the insurgents have specifically targeted. The Pakistani security response includes substantial extrajudicial disappearance, documented by the Voice for Baloch Missing Persons and various Pakistani human-rights organisations.",
    cites: [3, 41] },
  { name: "Afghanistan Pakistan War", countries: ["Afghanistan", "Pakistan"], region: "South Asia", category: "Armed Conflict", start: 2024, end: 2026, deaths: "ongoing, hundreds+", displaced: "~115k",
    note: "Recurrent military exchanges between the Pakistani state and the Afghan Taliban government since 2024 escalated to open war on **27 February 2026**, when Pakistan conducted simultaneous strikes on Kabul, Nangarhar, Paktika, and Kandahar against alleged **TTP** sanctuaries, with a follow-on Kabul strike on 16 March 2026 that UNAMA recorded as killing at least 145 (the Afghan government claimed more than 400). Approximately one hundred fifteen thousand civilians have been displaced from the border districts, and the Pakistani government's mass expulsion of approximately 1.7 million Afghan refugees from 2023 onward has produced a parallel humanitarian crisis. The conflict's eventual trajectory will depend on the Taliban's willingness or ability to constrain the TTP, which has not yet been demonstrated.",
    cites: [4, 41] },
  { name: "2025 India Pakistan War (Operation Sindoor)", countries: ["India", "Pakistan"], region: "South Asia", category: "Armed Conflict", start: 2025, end: 2025, deaths: "~70+", displaced: "~300k",
    note: "The **22 April 2025 Pahalgam attack** by Pakistan-based militants that killed twenty-six Indian tourists, predominantly Hindu, in Indian-administered Kashmir prompted **Operation Sindoor**, an Indian campaign of cross-border strikes against Pakistani military and militant targets including the deepest Indian military penetration into Pakistani territory since 1971. The eight-day crisis killed at least seventy people across both sides and displaced approximately three hundred thousand from the border districts, before American-mediated de-escalation announced by President Trump on 10 May 2025 produced a ceasefire that broadly held. The episode demonstrated the operational maturation of Indian standoff strike capability, the persistence of the Kashmir-linked terrorism nexus, and the continuing structural risk of escalation between two nuclear-armed neighbours.",
    cites: [5, 41] },
  { name: "Partition of India Massacres", countries: ["India", "Pakistan"], region: "South Asia", category: "Political Violence", start: 1946, end: 1948, deaths: "1 to 2 M", displaced: "14 to 18 M",
    note: "The partition of British India in August 1947 unleashed communal violence concentrated in **Punjab and Bengal** as approximately fourteen to eighteen million people crossed the new borders in what remains the **largest forced migration in human history**. Death-toll estimates vary substantially, with Ian Talbot and Gurharpal Singh's authoritative *The Partition of India* (Cambridge, 2009) giving a range of one to two million dead and the higher end of the historiographical range reaching three million. Sikhs in the Punjab suffered the highest proportional casualties of any community. The cascade of pre-partition violence from Calcutta in August 1946 through Bihar, Noakhali, and the Rawalpindi rural massacres of March 1947 to the catastrophe of August and September 1947 produced patterns of communal organisation and state-communal collusion that have continued to structure South Asian politics across the following eight decades.",
    cites: [18] },
  { name: "Sri Lankan JVP First Insurrection Suppression", countries: ["Sri Lanka"], region: "South Asia", category: "Political Violence", start: 1971, end: 1971, deaths: "~4k to 5k", displaced: "~20k arrested",
    note: "The **Janatha Vimukthi Peramuna (JVP)** founded by Rohana Wijeweera launched an attempted Marxist insurrection across Sri Lanka in April 1971, briefly seizing several police stations before the Sirimavo Bandaranaike government's counterinsurgency campaign suppressed the rising within six weeks. Approximately four thousand to five thousand were killed, principally young rural Sinhalese, and more than twenty thousand suspects were arrested and held in rehabilitation camps. The episode demonstrated the persistence of left mobilisation in postcolonial Sri Lanka alongside the dominant ethnonationalist politics, and Wijeweera's release from prison in 1977 set the stage for the second and far more lethal JVP insurrection of 1987 to 1990.",
    cites: [41] },
  { name: "1984 Anti Sikh Pogrom", countries: ["India"], region: "South Asia", category: "Political Violence", start: 1984, end: 1984, deaths: "3k to 17k", displaced: "~50k",
    note: "Following the **31 October 1984 assassination of Prime Minister Indira Gandhi by her two Sikh bodyguards**, organised mobs led in many neighbourhoods by Indian National Congress local figures attacked Sikh communities in Delhi and across multiple other cities during a four-day pogrom that the 1987 Ahuja Committee confirmed killed at least 2,733 Sikhs in Delhi alone. Broader national estimates range from three thousand (Government of India) to between eight and seventeen thousand (Akal Takht and civil-society sources). The **Nanavati Commission report** in 2005 and the People's Union for Democratic Rights' November 1984 report *Who Are the Guilty?* documented organised state and party complicity. As of 2024, only one death-penalty conviction had been secured in the Sajjan Kumar case, and the broader question of accountability remains a touchstone of Indian transitional-justice politics.",
    cites: [6, 41] },
  { name: "Sri Lankan JVP Second Insurrection and Politicide", countries: ["Sri Lanka"], region: "South Asia", category: "Political Violence", start: 1987, end: 1990, deaths: "~30k to 60k", displaced: "60k+ disappeared",
    note: "The second **JVP** uprising emerged in response to the Indo-Sri Lanka Accord of 1987 and was suppressed by the United National Party government under Presidents Jayewardene and **Ranasinghe Premadasa** through a counterinsurgency campaign that Barbara Harff of the US Naval Academy and others classify as a **politicide**. JVP-attributed killings reached approximately six thousand to seventeen thousand, while state and state-sponsored death-squad killings have been documented at between thirteen thousand and thirty thousand by Harff and at far higher figures including over sixty thousand disappearances by European parliamentary delegations and Sri Lankan civil society. The Batalanda Commission documented systematic torture, and the **UN Working Group on Enforced or Involuntary Disappearances** visited Sri Lanka in 1991 and 1992. JVP leader **Wijeweera was killed in army custody in November 1989**, ending the insurrection.",
    cites: [41] },
  { name: "2002 Gujarat Anti Muslim Pogrom", countries: ["India"], region: "South Asia", category: "Political Violence", start: 2002, end: 2002, deaths: "1k to 2k+", displaced: "~150k",
    note: "Following the **27 February 2002 Godhra train fire** that killed fifty-eight Hindu pilgrims, organised mobs associated with the Vishwa Hindu Parishad, Bajrang Dal, and the Rashtriya Swayamsevak Sangh family of organisations conducted three months of attacks on Muslims in Ahmedabad, Naroda Patiya, the Gulberg Society, and elsewhere across Gujarat. Official Indian government figures recorded 1,044 dead with 223 missing and 2,548 injured, while civil-society documentation including the Concerned Citizens Tribunal placed the toll at approximately 1,926, and some estimates reach five thousand. Approximately one hundred fifty thousand were displaced. Senior IPS officer Sanjiv Bhatt's testimony that then-Chief Minister **Narendra Modi** had instructed police to allow Hindu retaliation was rejected by the Supreme Court-appointed Special Investigation Team, which did not file charges against Modi. Human Rights Watch's contemporaneous report *We Have No Orders to Save You* documented state complicity.",
    cites: [6, 41] },
  { name: "Sri Lankan Civil War Final Phase (Mullivaikkal)", countries: ["Sri Lanka"], region: "South Asia", category: "Political Violence", start: 2009, end: 2009, deaths: "40k to 70k+", displaced: "~290k detained",
    note: "From January to **18 May 2009**, in the final phase of the military offensive against the LTTE, the Sri Lankan Armed Forces shelled designated **No Fire Zones** along the Mullaitivu coast in which civilians had been concentrated. The UN Report of the Secretary-General's Panel of Experts on Accountability in Sri Lanka in March 2011 stated that as many as forty thousand civilian deaths may have occurred; an internal UN review known as the **Petrie Report**, released in November 2012, raised that figure to at least seventy thousand. Approximately two hundred ninety thousand Tamil civilians were held in military-controlled internment camps after the war's end. The pursuit of accountability under transitional justice has been intermittent and incomplete, and the events of Mullivaikkal remain the central unresolved trauma of Sri Lankan Tamil political identity.",
    cites: [23] },
  { name: "Tajikistani Civil War", countries: ["Tajikistan"], region: "Central Asia", category: "Armed Conflict", start: 1992, end: 1997, deaths: "50k to 100k", displaced: "~1.2 M cumulative",
    note: "The Tajikistani civil war broke out in May 1992 within months of independence from the Soviet Union and pitted the former communist nomenklatura, supported by Russia and Uzbekistan, against the **United Tajik Opposition** combining Islamist, regionalist, and democratic factions. The five-year war killed an estimated fifty thousand to one hundred thousand Tajiks, displaced approximately 1.2 million cumulatively, and produced patterns of population concentration in Kulob and Khatlon Oblast that reshaped the Tajik political geography. The **June 1997 General Agreement on the Establishment of Peace** signed in Moscow integrated the UTO into the political system under a thirty-percent quota arrangement that **President Emomali Rahmon** has since systematically eroded.",
    cites: [1, 41] },
  { name: "Kyrgyz Uzbek Ethnic Violence", countries: ["Kyrgyzstan", "Uzbekistan"], region: "Central Asia", category: "Armed Conflict", start: 2010, end: 2010, deaths: "~470", displaced: "~400k briefly",
    note: "Following the **April 2010 Kyrgyz revolution** that removed President Kurmanbek Bakiyev, ethnic violence between Kyrgyz and Uzbek communities erupted in **Osh and Jalal-Abad** in southern Kyrgyzstan in June 2010, killing approximately 470 people, predominantly Uzbeks, and briefly displacing some four hundred thousand across the Uzbekistani border before refugee return. The **Kyrgyzstan Inquiry Commission** chaired by Kimmo Kiljunen of Finland concluded that elements of the violence may have constituted crimes against humanity, a finding that the Kyrgyz government rejected. The episode demonstrated the persistence of ethnic-territorial fragility in the Ferghana Valley and the limited capacity of the post-Soviet Central Asian states to suppress communal violence absent Russian or larger external intervention.",
    cites: [6, 41] },
  { name: "Kyrgyz Tajik Border Conflict", countries: ["Kyrgyzstan", "Tajikistan"], region: "Central Asia", category: "Armed Conflict", start: 2021, end: 2022, deaths: "~150+", displaced: "~50k briefly",
    note: "Repeated clashes along the unfinished Kyrgyz-Tajik border in the **Ferghana Valley**, particularly around the Vorukh enclave and water-resource access points, escalated to brief but intense military exchanges in April 2021 and September 2022 that killed approximately 150 people combined and produced significant short-term displacement. The conflict reflects the unresolved cartographic legacy of Soviet-era administrative boundaries, the asymmetric institutional capacity of the two states, and the resource pressures particularly around water and pasture rights in a region of high agricultural density. The 2024 demarcation framework agreement has provided a basis for progress but has not been fully implemented.",
    cites: [3, 41] },
  { name: "Andijan Massacre", countries: ["Uzbekistan"], region: "Central Asia", category: "Political Violence", start: 2005, end: 2005, deaths: "~500 to 1,500 contested", displaced: "thousands fled",
    note: "Following the arrest of twenty-three Akramiya businessmen on charges of religious extremism, supporters stormed the prison and military barracks in Andijan, Uzbekistan, on the night of 12 to 13 May 2005, after which thousands of unarmed protesters gathered on Bobur Square. Uzbek **National Security Service (SNB)** and Interior Ministry forces opened fire on the crowd from armoured vehicles and sniper positions on the morning of **13 May 2005**. Official Uzbek government count: 187 killed, characterised as terrorists and security personnel; Human Rights Watch's June 2005 field investigation report concluded that hundreds were killed; the combined estimate from the UN High Commissioner for Human Rights, OSCE, Amnesty International, and HRW reaches 500 to 700; defector SNB Major Ikrom Yakubov gave a figure of approximately 1,500. **President Islam Karimov** refused an international investigation. The massacre led to the closure of the American Karshi-Khanabad airbase and a substantial tilt of Uzbek foreign policy toward Russia and the Shanghai Cooperation Organisation until partial reform under Shavkat Mirziyoyev after 2016.",
    cites: [6, 41] },
  { name: "1948 Arab Israeli War", countries: ["Israel", "Palestine", "Egypt", "Jordan", "Syria", "Lebanon", "Iraq"], region: "West Asia", category: "Armed Conflict", start: 1948, end: 1949, deaths: "~20k", displaced: "~750k Palestinians",
    note: "Following the **UN partition vote of 29 November 1947** and the British Mandate's expiration on 14 May 1948, the first Arab-Israeli war combined the prior civil war between Palestinian Arabs and the Yishuv with the conventional intervention of Egyptian, Jordanian, Syrian, Iraqi, and Lebanese forces. The war killed approximately twenty thousand combatants and civilians and produced the **Nakba**, the displacement of approximately 750,000 Palestinians from what became the State of Israel, who became the founding refugee population whose continued existence as a juridical category has structured every subsequent phase of the Israeli-Palestinian conflict. The 1949 armistice lines, known as the Green Line, defined Israeli territory until the Six Day War of 1967.",
    cites: [1, 5] },
  { name: "Suez Crisis", countries: ["Israel", "Egypt"], region: "West Asia", category: "Armed Conflict", start: 1956, end: 1956, deaths: "~3k", displaced: "minimal",
    note: "The combined British, French, and Israeli operation against Egypt in **October to November 1956**, prompted by Gamal Abdel Nasser's nationalisation of the Suez Canal Company in July, ended in the diplomatic humiliation of the European powers when the United States under Eisenhower forced their withdrawal through financial pressure on the British pound. Approximately three thousand Egyptians and several hundred coalition troops died in the brief campaign. The crisis marked the **practical end of British and French imperial power in the Middle East**, consolidated Nasser's position as the dominant Arab nationalist figure, and accelerated the American assumption of the regional security role that has continued under modified forms ever since.",
    cites: [5, 41] },
  { name: "1958 Lebanon Crisis", countries: ["Lebanon"], region: "West Asia", category: "Armed Conflict", start: 1958, end: 1958, deaths: "~4k", displaced: "minimal",
    note: "The political crisis between pro-Western Maronite President Camille Chamoun and the Nasserist opposition led by Sunni and Druze political figures escalated into low-intensity civil war in 1958 amid the broader regional turbulence of the Iraqi revolution that overthrew the Hashemite monarchy in July 1958. **American intervention under Operation Blue Bat**, the first deployment under the Eisenhower Doctrine, landed approximately fourteen thousand US troops in Lebanon and stabilised the situation without significant combat. The crisis produced the **Chehab compromise** that institutionalised the confessional consociation arrangement under which Lebanon would govern itself until the comprehensive breakdown of 1975.",
    cites: [5, 41] },
  { name: "First Iraqi Kurdish War", countries: ["Iraq"], region: "West Asia", category: "Armed Conflict", start: 1961, end: 1970, deaths: "~100k", displaced: "~300k",
    note: "Mustafa Barzani's **Kurdistan Democratic Party** launched its first armed campaign against the central government in Baghdad in September 1961 over the unfulfilled federalism provisions of the 1958 revolution. The nine-year war passed through the Qassim, Arif, and early Ba'athist governments and produced approximately one hundred thousand deaths and three hundred thousand displaced. The 11 March 1970 **autonomy agreement** between the Ba'athist government of Ahmed Hassan al-Bakr and Saddam Hussein on one side and Barzani on the other was widely celebrated but never fully implemented, and the resumption of fighting in 1974 set the conditions for the catastrophic outcomes of the Anfal campaign in the following decade.",
    cites: [1, 5] },
  { name: "Dhofar Rebellion", countries: ["Oman"], region: "West Asia", category: "Armed Conflict", start: 1962, end: 1976, deaths: "~10k", displaced: "~50k",
    note: "The Dhofar Liberation Front, later renamed the **Popular Front for the Liberation of Oman**, fought a Marxist-Leninist insurgency against the Omani sultanate supported from neighbouring South Yemen with Soviet and Chinese assistance from 1968 onward. The combination of Sultan Qaboos's 1970 coup against his isolationist father Said bin Taimur, the modernisation and infrastructure investment programme he then launched, the deployment of British Special Air Service teams under Operation Storm, and substantial Iranian intervention under the Shah from 1973 to 1975 progressively eroded the insurgents' position. The rebellion ended formally in December 1976. The episode is sometimes cited as a model successful counterinsurgency campaign, though the political economy of oil wealth that funded the offer of modernisation was difficult to reproduce elsewhere.",
    cites: [41] },
  { name: "North Yemen Civil War", countries: ["Yemen"], region: "West Asia", category: "Armed Conflict", start: 1962, end: 1970, deaths: "~200k", displaced: "~100k",
    note: "Following the **September 1962 republican coup** against Imam Muhammad al-Badr, the eight-year civil war pitted the new republican government, supported by Egyptian expeditionary forces that peaked at seventy thousand troops, against royalist tribal forces supported by Saudi Arabia, Jordan, and Iran. The conflict has been characterised as Nasser's Vietnam, both in its operational difficulty and in its political effects on the broader Egyptian regional position. Combined deaths reached approximately two hundred thousand. The **Egyptian withdrawal following the June 1967 Six-Day War defeat** opened the way to the 1970 reconciliation between the warring Yemeni parties on a republican but conservative basis.",
    cites: [1, 5] },
  { name: "Aden Emergency", countries: ["Yemen"], region: "West Asia", category: "Armed Conflict", start: 1963, end: 1967, deaths: "~600", displaced: "minimal",
    note: "The four-year campaign between British colonial forces and the **National Liberation Front** (and the rival Front for the Liberation of South Yemen) ended with British withdrawal from Aden on 30 November 1967 and the formation of the **People's Democratic Republic of Yemen**, the only Marxist state in the Arab world. Approximately six hundred combatants died across the campaign. The British departure marked the effective end of imperial commitments east of Suez articulated under the Wilson government's 1968 strategic review.",
    cites: [41] },
  { name: "Six Day War", countries: ["Israel", "Egypt", "Syria", "Jordan", "Palestine"], region: "West Asia", category: "Armed Conflict", start: 1967, end: 1967, deaths: "~20k", displaced: "~300k Palestinians",
    note: "The **5 to 10 June 1967 war** in which Israel pre-emptively struck Egyptian, Syrian, and later Jordanian forces and captured the Sinai Peninsula, the Golan Heights, the West Bank, the Gaza Strip, and East Jerusalem within six days reshaped the Middle East decisively and produced approximately twenty thousand Arab and one thousand Israeli combatant deaths along with approximately three hundred thousand displaced Palestinians. The captured territories doubled the area under Israeli control and produced the **occupied territories question** that has dominated regional politics since. **UN Security Council Resolution 242** established the land-for-peace framework that would underpin the eventual Egyptian-Israeli and Jordanian-Israeli peace treaties, but the unresolved Palestinian status has persisted as the principal unfinished business of the post-1967 order.",
    cites: [1, 5] },
  { name: "War of Attrition", countries: ["Israel", "Egypt"], region: "West Asia", category: "Armed Conflict", start: 1967, end: 1970, deaths: "~10k", displaced: "~750k Suez Canal",
    note: "The sustained low-intensity conflict along the Suez Canal between Egypt and Israel from 1967 to 1970 was a deliberate Egyptian strategy under Nasser to impose costs on the Israeli occupation of Sinai without large-scale conventional war. The campaign featured Soviet pilots flying combat missions against Israeli aircraft, sustained artillery exchanges along the canal, and approximately ten thousand combined casualties. The cities of **Ismailia, Suez, and Port Said were largely evacuated**, producing roughly three quarters of a million internal Egyptian displaced. The American-mediated Rogers Plan ceasefire of August 1970 ended the war and set conditions for the 1973 war that followed.",
    cites: [1, 41] },
  { name: "Black September", countries: ["Jordan", "Palestine"], region: "West Asia", category: "Armed Conflict", start: 1970, end: 1971, deaths: "~10k", displaced: "~150k",
    note: "The **September 1970 to July 1971 conflict** between King Hussein's Jordanian Armed Forces and the Palestine Liberation Organisation that had built a parallel state in Jordan culminated in the expulsion of the PLO from the country. Combined deaths reached approximately ten thousand. The PLO's relocation to **Lebanon** shifted the regional fulcrum of the Palestinian armed struggle and produced the conditions for the Lebanese civil war that began in 1975. The episode also produced the eponymous Black September Organisation responsible for the **Munich Olympics attack of September 1972**.",
    cites: [1, 41] },
  { name: "Yom Kippur War", countries: ["Israel", "Egypt", "Syria"], region: "West Asia", category: "Armed Conflict", start: 1973, end: 1973, deaths: "~20k", displaced: "~300k",
    note: "The **6 to 25 October 1973 surprise attack** by Egypt across the Suez Canal and Syria onto the Golan Heights came closer than any subsequent Arab-Israeli war to imposing strategic defeat on Israel, before American resupply through Operation Nickel Grass and the IDF's counteroffensive that crossed the canal and encircled the Egyptian Third Army restored the Israeli military position. Combined deaths reached approximately twenty thousand. The diplomatic settlement under Henry Kissinger's shuttle diplomacy produced disengagement agreements that began the bilateral process culminating in the **Camp David Accords of September 1978** and the Egyptian-Israeli peace treaty of 1979, the first Arab recognition of Israel.",
    cites: [1, 5] },
  { name: "Lebanese Civil War", countries: ["Lebanon"], region: "West Asia", category: "Armed Conflict", start: 1975, end: 1990, deaths: "~150k", displaced: "~1 M",
    note: "The fifteen-year civil war that began in April 1975 combined the Lebanese confessional crisis between Christian and Muslim communities, the **state-within-a-state of the PLO** based in West Beirut, repeated Syrian and Israeli interventions, and the proxy involvement of the United States, France, and Iran. The war killed approximately one hundred fifty thousand and displaced approximately one million Lebanese, and produced the conditions for the emergence of **Hezbollah** as the durable Shia armed-political force that would shape Lebanese politics across the following four decades. The **1989 Taif Agreement** brokered by Saudi Arabia and the Arab League ended the war by adjusting but preserving the confessional power-sharing arrangement that had structured Lebanese politics since independence.",
    cites: [1, 5] },
  { name: "Iran Iraq War", countries: ["Iran", "Iraq"], region: "West Asia", category: "Armed Conflict", start: 1980, end: 1988, deaths: "~1 M", displaced: "~2 M",
    note: "Saddam Hussein's invasion of post-revolutionary Iran on **22 September 1980** initiated the **bloodiest conventional war of the post-1945 era**, fought across eight years with extensive use of trench warfare, child soldiers in human-wave attacks on the Iranian side, and Iraqi use of chemical weapons against both Iranian forces and the regime's own Kurdish civilians. Approximately one million people died and two million were displaced across both countries. The war was financed substantially by the Arab Gulf states for Iraq and produced the structural Iraqi debt that would help motivate Saddam's later invasion of Kuwait. The UN-mediated ceasefire under **Security Council Resolution 598 in July 1988** was accepted by Ayatollah Khomeini in his characterisation as 'drinking the cup of poison.'",
    cites: [5] },
  { name: "1982 Lebanon War", countries: ["Lebanon", "Israel"], region: "West Asia", category: "Armed Conflict", start: 1982, end: 1982, deaths: "17k to 19k+", displaced: "~500k",
    note: "The Israeli invasion launched on **6 June 1982** as **Operation Peace for Galilee** was designed by Defence Minister Ariel Sharon to destroy the PLO infrastructure in Lebanon and install a Maronite-led government allied with Israel. Israeli forces reached Beirut, the PLO leadership was expelled to Tunis, and the **Sabra and Shatila massacres** of 16 to 18 September 1982, conducted by Phalangist militia under Israeli oversight, killed an estimated eight hundred to thirty-five hundred Palestinian and Lebanese Shia civilians. The Kahan Commission found Sharon indirectly responsible for the massacres. Total deaths across the campaign reached seventeen to nineteen thousand, and the most significant strategic consequence was the **formation of Hezbollah** under Iranian sponsorship in response to the Israeli occupation of southern Lebanon.",
    cites: [5, 41] },
  { name: "PKK Insurgency", countries: ["Turkey"], region: "West Asia", category: "Armed Conflict", start: 1984, end: 2025, deaths: "~40k", displaced: "~1 M Turkish internal",
    note: "The **Kurdistan Workers' Party (PKK)** launched its armed campaign against the Turkish state on 15 August 1984, demanding cultural and political rights for Turkey's Kurdish population and, in its early phase, an independent Kurdistan. The forty-one-year conflict has killed approximately thirty to forty thousand and produced about three hundred fifty thousand internally displaced Kurds, alongside extensive Turkish military operations into northern Iraq and Syria. **Abdullah Öcalan's capture in Kenya in February 1999** transferred the strategic centre of gravity to a single imprisoned leader whose theoretical evolution toward democratic confederalism has shaped the movement since. The PKK announced its **dissolution on 12 May 2025** following Öcalan's February 2025 call from his prison cell on İmralı Island, marking the most significant Kurdish-Turkish political opening since the war began.",
    cites: [41] },
  { name: "South Lebanon Conflict", countries: ["Lebanon", "Israel"], region: "West Asia", category: "Armed Conflict", start: 1985, end: 2000, deaths: "~6k", displaced: "~500k periodically",
    note: "Israel maintained a **security zone in southern Lebanon** after the 1985 withdrawal from most of Lebanon, working through the **South Lebanon Army** proxy under Antoine Lahad to contain Hezbollah operations against the northern Israeli frontier. The fifteen-year occupation produced approximately six thousand deaths and recurrent waves of displacement of southern Lebanese civilians. The **unilateral Israeli withdrawal in May 2000** under Prime Minister Ehud Barak ended the occupation and was claimed by Hezbollah as a strategic victory that consolidated its position as the dominant parallel state actor in Lebanon, a position that the subsequent decades have only reinforced.",
    cites: [5, 41] },
  { name: "South Yemen Civil War", countries: ["Yemen"], region: "West Asia", category: "Armed Conflict", start: 1986, end: 1986, deaths: "~10k", displaced: "~60k",
    note: "The brief but extraordinarily violent **intra-Yemeni Socialist Party purge** in Aden in January 1986 killed approximately ten thousand party members and civilians in roughly two weeks of factional fighting that began at a Politburo meeting. The conflict weakened the People's Democratic Republic of Yemen institutionally and demographically and prepared the ground for the **May 1990 unification** with the Yemen Arab Republic that produced the contemporary Republic of Yemen.",
    cites: [41] },
  { name: "First Intifada", countries: ["Palestine", "Israel"], region: "West Asia", category: "Armed Conflict", start: 1987, end: 1993, deaths: "~2k", displaced: "minimal",
    note: "The Palestinian uprising in the West Bank and Gaza that began in **December 1987** after a traffic incident in Gaza was characterised by mass civil resistance including strikes, tax refusal, and stone-throwing youth confrontations with Israeli forces. **B'Tselem** documented between 1,087 and 1,204 Palestinians killed by Israeli forces against approximately 179 Israelis killed by Palestinians. The political effects produced the **Oslo Process** that culminated in the September 1993 Declaration of Principles, the establishment of the Palestinian Authority, and the territorial fragmentation of the West Bank into Areas A, B, and C that has structured the spatial reality of occupation ever since.",
    cites: [41] },
  { name: "First Nagorno Karabakh War", countries: ["Armenia", "Azerbaijan"], region: "West Asia", category: "Armed Conflict", start: 1988, end: 1994, deaths: "~30k", displaced: "~1 M",
    note: "The Armenian-Azerbaijani conflict over the predominantly Armenian-populated **Nagorno-Karabakh** enclave within Soviet Azerbaijan began with the Sumgait pogrom of February 1988 and escalated through the dissolution of the Soviet Union into a full conventional war from 1992 to 1994. Armenia established de facto control over Nagorno-Karabakh and seven surrounding Azerbaijani districts, displacing approximately 724,000 Azerbaijanis and between 300,000 and 500,000 Armenians. The **May 1994 Bishkek Protocol** ceasefire froze the conflict for a generation under Russian mediation, with periodic flare-ups including the April 2016 four-day war, until the comprehensive Azerbaijani military reversal of the 2020 war.",
    cites: [1, 41] },
  { name: "Gulf War", countries: ["Iraq", "Kuwait", "Saudi Arabia"], region: "West Asia", category: "Armed Conflict", start: 1990, end: 1991, deaths: "~30k", displaced: "~5 M (incl. return migrations)",
    note: "Saddam Hussein's **invasion of Kuwait on 2 August 1990** prompted the assembly of a thirty-five-nation coalition under American leadership that included substantial Arab participation, and **Operation Desert Storm** from 17 January to 28 February 1991 ejected Iraqi forces from Kuwait through forty-two days of air operations and a hundred-hour ground campaign. Iraqi deaths reached an estimated twenty to thirty-five thousand against coalition deaths of 378. Saddam Hussein remained in power, the **no-fly zones** over northern and southern Iraq were established, and the prolonged American military presence in Saudi Arabia produced the grievance structure that Osama bin Laden cited as central to the formation of al-Qaeda.",
    cites: [1, 5] },
  { name: "1991 Iraqi Uprisings", countries: ["Iraq"], region: "West Asia", category: "Armed Conflict", start: 1991, end: 1991, deaths: "~85k", displaced: "~2 M",
    note: "The **Shia uprising in the south** beginning at Basra on 1 March 1991 and the **Kurdish uprising in the north** that swept through Sulaymaniyah, Erbil, and Kirkuk in mid-March, both encouraged by President George H.W. Bush in his 15 February call for the Iraqi people to overthrow Saddam Hussein, were suppressed brutally when American forces did not intervene to support them. Approximately thirty to sixty thousand Shia were killed in the south and twenty thousand Kurds in the north, and 1.5 to 2 million were displaced, principally Kurds fleeing toward Turkey and Iran. The international response produced the **no-fly zones** that would create the de facto autonomy of Iraqi Kurdistan and that endured until 2003.",
    cites: [5, 41] },
  { name: "Second Intifada", countries: ["Palestine", "Israel"], region: "West Asia", category: "Armed Conflict", start: 2000, end: 2005, deaths: "~5k", displaced: "minimal",
    note: "Triggered by **Ariel Sharon's visit to the Temple Mount on 28 September 2000** and the breakdown of the Camp David II negotiations that summer, the second Palestinian uprising featured a more militarised character than the first, with Palestinian suicide bombings of Israeli civilian targets and a parallel Israeli reoccupation of West Bank cities. Combined deaths reached approximately five thousand at a Palestinian-to-Israeli ratio of slightly more than three to one. The **Oslo framework effectively collapsed**, the second Camp David failure deflated the diplomatic process, and the era opened by Yitzhak Rabin's 1995 assassination closed with Sharon's 2005 unilateral Gaza disengagement and the construction of the West Bank separation barrier that has since defined the geography of occupation.",
    cites: [5, 41] },
  { name: "Iraq War", countries: ["Iraq"], region: "West Asia", category: "Armed Conflict", start: 2003, end: 2011, deaths: "500k+", displaced: "~5 M",
    note: "The American-led invasion that began on **19 March 2003**, justified by the subsequently discredited claims regarding Iraqi weapons of mass destruction, removed Saddam Hussein within three weeks but inaugurated a sustained insurgency that escalated into a Sunni-Shia civil war reaching genocidal intensity in 2006 to 2007. **Hagopian and colleagues' 2013 PLOS Medicine analysis** estimated approximately 405,000 excess deaths with a 95 percent uncertainty interval ranging from 48,000 to 751,000, and Iraq Body Count separately documented more than 114,000 civilian violent deaths. Five million Iraqis were displaced. The American troop surge of 2007 to 2008 under General David Petraeus and the Sunni Awakening produced a partial stabilisation, but the **withdrawal completed in December 2011** left the political settlement incomplete and produced the conditions in which the **Islamic State** emerged in 2014.",
    cites: [9, 24] },
  { name: "Houthi Sa'dah Insurgency", countries: ["Yemen"], region: "West Asia", category: "Armed Conflict", start: 2004, end: 2010, deaths: "~25k", displaced: "~250k",
    note: "**Six rounds of fighting** between the government of Ali Abdullah Saleh and the Houthi movement (Ansar Allah) in Sa'dah governorate of northern Yemen across six years killed approximately twenty-five thousand and displaced an estimated 342,000 internally by mid-2010. The conflict had roots in the political marginalisation of the Zaidi Shia community and the personal trajectory of Hussein Badreddin al-Houthi, who was killed in the first round in September 2004. The Sa'dah insurgency was the structural precursor of the **2014 Yemeni Civil War** and demonstrated the operational limits of the Saleh state in its peripheral regions.",
    cites: [41] },
  { name: "2006 Lebanon War", countries: ["Lebanon", "Israel"], region: "West Asia", category: "Armed Conflict", start: 2006, end: 2006, deaths: "~1.5k", displaced: "~1 M",
    note: "Thirty-four days of fighting from **12 July to 14 August 2006** between Israel and Hezbollah, triggered by a Hezbollah cross-border raid that captured two Israeli soldiers and killed three, demonstrated the operational maturation of Hezbollah's military wing and the limits of Israeli air power against an entrenched non-state adversary. Human Rights Watch documented at least 1,109 Lebanese deaths with the great majority civilian and 4,399 injured; Israeli casualties included 43 civilians and 121 IDF soldiers. The war ended with **UN Security Council Resolution 1701** and the expansion of UNIFIL but did not displace Hezbollah from southern Lebanon, and the lessons absorbed by both sides shaped the 2023 to 2024 escalation.",
    cites: [6, 41] },
  { name: "Syrian Civil War", countries: ["Syria"], region: "West Asia", category: "Armed Conflict", start: 2011, end: 2024, deaths: "~580k+", displaced: "~13 M",
    note: "The Syrian civil war began with **Arab Spring protests in Daraa in March 2011** and escalated through a multi-sided conflict involving the Assad regime, varied opposition factions, the autonomous Kurdish administration, the Islamic State, and the external intervention of Russia, Iran, Turkey, Hezbollah, the United States, and the Gulf states. The UN Commission of Inquiry's cumulative documentation reaches more than **580,000 killed and 13 million Syrians forcibly displaced**, of whom approximately 6.6 million sought refuge outside the country, principally in Turkey, Lebanon, Jordan, and Europe. The Assad regime fell to a **Hayat Tahrir al-Sham-led offensive on 8 December 2024**, ending fifty-four years of Assad family rule and producing the rapid withdrawal of Russian and Iranian forces and the transitional government under Ahmad al-Sharaa.",
    cites: [25, 26] },
  { name: "War Against ISIS", countries: ["Iraq", "Syria"], region: "West Asia", category: "Armed Conflict", start: 2013, end: 2019, deaths: "150k+", displaced: "~6 M",
    note: "The Islamic State proclaimed its **Caliphate on 29 June 2014** after seizing Mosul and rapidly extending control over roughly one third of Iraq and Syria, prompting a counter-coalition of more than eighty states alongside Iraqi Security Forces, the Kurdish-led Syrian Democratic Forces, Iranian-backed militias, and Russian forces operating on largely parallel rather than coordinated tracks. Direct conflict deaths reached an estimated one hundred thousand to two hundred thousand, with more than six million displaced. **Territorial defeat at Baghuz on 23 March 2019** ended the territorial Caliphate, although the group's underground networks continue to operate. The Islamic State leader **Abu Bakr al-Baghdadi was killed in a US Special Operations raid in Idlib on 26 October 2019**.",
    cites: [3, 5] },
  { name: "Yemeni Civil War", countries: ["Yemen", "Saudi Arabia"], region: "West Asia", category: "Armed Conflict", start: 2014, end: 2026, deaths: "~400k", displaced: "~4.5 M",
    note: "The **Houthi capture of Sana'a in September 2014** and the subsequent Saudi-led intervention from March 2015 produced a war that the United Nations has repeatedly described as the **world's worst humanitarian crisis**. The UN-cited 2022 estimate gives 377,000 deaths through 2022, with sixty percent indirect from disease and famine, and total displacement reaching approximately 4.5 million. The April 2022 ceasefire produced a substantial reduction in active military operations but did not produce a political settlement, and Houthi maritime operations against Red Sea shipping in solidarity with Gaza since late 2023 have made Yemen a node in the broader regional escalation.",
    cites: [3, 4] },
  { name: "2020 Nagorno Karabakh War", countries: ["Armenia", "Azerbaijan"], region: "West Asia", category: "Armed Conflict", start: 2020, end: 2020, deaths: "~6.5k", displaced: "~90k",
    note: "The **forty-four-day war** from 27 September to 10 November 2020 saw Azerbaijan recover most of the territory lost in the first Nagorno-Karabakh war, demonstrating the operational impact of **Turkish Bayraktar TB2** and Israeli Harop drone systems against entrenched but technologically outdated Armenian defences. The **Karlinsky 2023 excess-mortality analysis** in *Population Research and Policy Review* gives approximately 6,500 deaths. The 9 November 2020 Russian-brokered ceasefire deployed Russian peacekeepers to the contracted Armenian enclave, an arrangement that broke down in the September 2023 final Azerbaijani offensive that completed the recovery of the entire disputed territory.",
    cites: [38, 41] },
  { name: "2023 Karabakh Offensive", countries: ["Azerbaijan", "Armenia"], region: "West Asia", category: "Armed Conflict", start: 2023, end: 2023, deaths: "~700 combined", displaced: "~100k Armenians",
    note: "Azerbaijan completed the recovery of Nagorno-Karabakh in a **twenty-four hour military operation on 19 to 20 September 2023** after a nine-month blockade of the Lachin Corridor that had progressively reduced the enclave's capacity to sustain its remaining Armenian population. Approximately **100,400 ethnic Armenians fled** to Armenia in the following two weeks, including roughly 218 who died in the **25 September Stepanakert fuel depot explosion** during the evacuation. The Republic of Artsakh **formally dissolved on 1 January 2024**, ending the territorial expression of the post-1988 Armenian Karabakh project after thirty-six years.",
    cites: [5, 41] },
  { name: "Israel Hamas Gaza War", countries: ["Israel", "Palestine"], region: "West Asia", category: "Armed Conflict", start: 2023, end: 2025, deaths: "~75k+", displaced: "~1.9 M",
    note: "The **Hamas-led attack on 7 October 2023** that killed approximately twelve hundred Israelis and took 251 hostages prompted an Israeli military campaign in Gaza that has produced the highest civilian casualty rate of any war of the twenty-first century. As of 3 May 2026, **at least 75,811 people had been reported killed** (more than 73,770 Palestinians and more than 2,039 Israelis), and a peer-reviewed Max Planck Institute study in November 2025 estimated 100,000 to 126,000 violent deaths in Gaza alone. Approximately 1.9 million Gazans (roughly ninety percent of the population) were displaced, in many cases multiple times. The **third ceasefire entered force on 10 October 2025** after the prior two had broken down within months, and the **South African genocide case at the International Court of Justice** remains in progress.",
    cites: [27] },
  { name: "Israel Hezbollah War", countries: ["Israel", "Lebanon"], region: "West Asia", category: "Armed Conflict", start: 2023, end: 2024, deaths: "~4.2k", displaced: "~1.4 M",
    note: "Cross-border exchanges between Israel and Hezbollah from **8 October 2023** escalated to full war in September 2024 with the coordinated **pager and walkie-talkie attacks** of 17 to 18 September that killed and wounded thousands of Hezbollah members, the Israeli ground incursion into southern Lebanon, and the **killing of Hassan Nasrallah** in an Israeli strike on Beirut's southern suburbs on 27 September 2024. The Lebanese government recorded 4,047 Lebanese killed and 16,638 injured, with 1.2 million displaced. The **ceasefire of 27 November 2024** ended the major fighting and weakened Hezbollah in ways that, combined with Iranian setbacks, contributed materially to the fall of the Assad regime two weeks later.",
    cites: [30] },
  { name: "2025 Israel Iran War (Twelve Day War)", countries: ["Israel", "Iran"], region: "West Asia", category: "Armed Conflict", start: 2025, end: 2025, deaths: "~1.2k", displaced: "minimal",
    note: "The twelve-day war beginning on **13 June 2025** opened with Israeli strikes on Iranian nuclear and missile infrastructure and the targeted killing of senior Iranian commanders and nuclear scientists. The **United States joined on 22 June under Operation Midnight Hammer**, striking Fordow, Natanz, and Isfahan with B-2 bombers and bunker-busting munitions in what was the most consequential American military action against Iran in the bilateral history. HRANA documented 1,190 Iranian deaths and 4,475 injured; the Times of Israel reported 29 Israeli deaths (twenty-eight civilians and one off-duty soldier). The 24 June 2025 ceasefire ended the active war without producing a political settlement and set the conditions for the second round of strikes that would follow in early 2026.",
    cites: [28, 29] },
  { name: "2026 Iran War and Killing of Khamenei", countries: ["Israel", "Iran"], region: "West Asia", category: "Armed Conflict", start: 2026, end: 2026, deaths: "~2k (ongoing)", displaced: "tens of thousands",
    note: "A second round of American and Israeli strikes on Iranian nuclear, military, and leadership infrastructure in **February to March 2026** culminated in the **targeted killing of Supreme Leader Ali Khamenei**, the most consequential decapitation of a state actor since the Second World War and an event without precedent in the bilateral history. The strikes, conducted following the breakdown of the 24 June 2025 ceasefire and renewed Iranian enrichment activity at Fordow, destroyed or substantially degraded the remaining Iranian nuclear infrastructure and produced a leadership succession crisis whose resolution remained unsettled as of May 2026. Iran's regional retaliation through Hezbollah missile launches from southern Lebanon triggered the resumption of Israeli operations against Lebanon recorded under the **2026 Lebanon War** entry. The strategic effect substantially weakened the Iranian regional position and accelerated the realignment of Gulf, Syrian, and Iraqi politics in the post-Assad and post-Khamenei configuration.",
    cites: [5, 28, 41] },
  { name: "2026 Lebanon War", countries: ["Israel", "Lebanon"], region: "West Asia", category: "Armed Conflict", start: 2026, end: 2026, deaths: "~2.6k+ (ongoing)", displaced: "~1 M",
    note: "Resumption of Israel-Hezbollah hostilities from **2 March 2026** was triggered by Hezbollah missile attacks following the assassination of Iranian Supreme Leader Ali Khamenei in the 2026 Iran war. Per OHCHR spokesperson **Thameen Al-Kheetan**'s 24 April 2026 press briefing, Israel's blanket evacuation warnings cover approximately fourteen percent of Lebanese territory and have produced the displacement of more than one million people. The renewed war effectively terminates the **November 2024 ceasefire** and represents the second major Israel-Hezbollah confrontation in two years, against the background of a substantially weakened Iranian regional position following the 2025 and 2026 events.",
    cites: [33] },
  { name: "Iraqi Anti Communist and Ba'athist Purges", countries: ["Iraq"], region: "West Asia", category: "Political Violence", start: 1963, end: 1979, deaths: "~3k to 5k+", displaced: "minimal",
    note: "Following the **8 February 1963 Ba'athist coup** against Abd al-Karim Qasim, Ba'ath Party-affiliated National Guard units, reportedly working from CIA-supplied target lists per Hanna Batatu's *The Old Social Classes and the Revolutionary Movements of Iraq* (Princeton, 1978), killed an estimated three to five thousand Iraqi Communist Party members and sympathisers. Sixteen years later, **Saddam Hussein's elevation to the presidency on 16 July 1979** was consolidated by the infamous **Ba'ath Regional Command meeting of 22 July 1979** at which sixty-eight senior officials were publicly named, twenty-two were summarily executed, and the others were forced to participate in their execution. Subsequent purges killed several hundred more. These episodes established the operational template of paranoid factional purging that would characterise the regime through to its 2003 collapse.",
    cites: [41] },
  { name: "Hama Massacre", countries: ["Syria"], region: "West Asia", category: "Political Violence", start: 1982, end: 1982, deaths: "10k to 40k", displaced: "minimal",
    note: "**Hafez al-Assad's response to the Muslim Brotherhood Hama uprising** in February 1982 consisted of a twenty-seven day siege from 2 to 28 February in which Major General **Rifaat al-Assad's** Defence Companies and special forces besieged the city of approximately 250,000, levelled the old city with artillery and tanks, and conducted house-to-house executions. Death-toll estimates: Amnesty International ten to twenty-five thousand; Robert Fisk in *The Independent* at least twenty thousand; Patrick Seale and Rifaat himself in subsequent public statements thirty to forty thousand. The Syrian Network for Human Rights identifies approximately seventeen thousand still missing, taken to Tadmur (Palmyra) prison and other facilities. The massacre **suppressed organised opposition in Syria for nearly three decades** until the 2011 uprising, and remained a taboo topic until the 8 December 2024 fall of the Assad regime allowed the first official commemoration in February 2025.",
    cites: [7, 25, 41] },
  { name: "Anfal Genocide", countries: ["Iraq"], region: "West Asia", category: "Political Violence", start: 1986, end: 1989, deaths: "50k to 180k", displaced: "thousands of villages destroyed",
    note: "Saddam Hussein's **eight-stage campaign against Iraqi Kurds**, commanded by Ali Hassan al-Majid known as 'Chemical Ali' with Saddam's explicit authorisation, was conducted across 1986 to 1989 with peak intensity in the spring and summer of 1988. Human Rights Watch's 1993 **Genocide in Iraq** report, based on captured Iraqi documents from the 1991 uprisings, estimates 50,000 to 100,000 Kurdish civilians killed, while Kurdish sources reach 182,000. More than four thousand villages were destroyed, and chemical weapons including mustard gas, tabun, sarin, and VX were used systematically. The single most catastrophic incident was the **Halabja chemical attack of 16 March 1988** that killed approximately five thousand civilians and injured seven to ten thousand more in one day. The **Dutch Hague court in 2005** and the Iraqi Supreme Criminal Tribunal in January 2010 classified the campaign as genocide; al-Majid was executed on 25 January 2010.",
    cites: [6, 41] },
  { name: "1988 Iranian Executions of Political Prisoners", countries: ["Iran"], region: "West Asia", category: "Political Violence", start: 1988, end: 1988, deaths: "~2.8k to 30k", displaced: "minimal",
    note: "Following the **Mojahedin-e Khalq's Operation Eternal Light** incursion from Iraq in late July 1988 immediately after Iran's UN-mediated acceptance of the ceasefire ending the Iran-Iraq War, **Supreme Leader Ayatollah Khomeini issued a secret fatwa** ordering the execution of all imprisoned MEK members who remained loyal to the organisation, and subsequently all leftist prisoners. Three-member **death commissions** including future president Ebrahim Raisi as Tehran deputy prosecutor processed prisoners in summary five-minute hearings across the summer and early autumn of 1988. Death-toll estimates: Human Rights Watch and Amnesty International give 2,800 to 5,000 killed; the MEK and *Daily Telegraph* reach 30,000. **UN Special Rapporteur on Iran Javaid Rehman's July 2024 atrocity-crimes report** found that the executions amounted to crimes against humanity of murder and extermination, and possibly genocide. Khomeini's designated successor Hossein-Ali Montazeri was demoted for protesting and his 2016 audiotape, released by his son, confirmed the systematic character of the operation.",
    cites: [7, 40] },
  { name: "Iraqi Marsh Arab Persecution", countries: ["Iraq"], region: "West Asia", category: "Political Violence", start: 1991, end: 2003, deaths: "tens of thousands", displaced: "~200k forcibly displaced",
    note: "Following the March 1991 Shia uprising suppression, Saddam Hussein systematically drained the **Mesopotamian marshes** through the construction of the 565-kilometre **Third River** canal and a network of supporting infrastructure, in what was simultaneously a counterinsurgency, an act of ethnic cleansing against the **Marsh Arabs**, and one of the largest environmental destructions of the late twentieth century. The UN Environment Programme's 2001 report found 85 percent of the marshlands lost, rising to ninety percent by 2003. The Marsh Arab population fell from approximately 250,000 to 500,000 in the 1950s baseline to fewer than 40,000. Human Rights Watch's January 2003 background paper concluded that the campaign constituted a crime against humanity. After 2003, partial rehydration restored approximately 58 percent of the marshland, and the Iraqi Marshes were inscribed by UNESCO as a **World Heritage Site in 2016**.",
    cites: [6, 8] },
  { name: "Yazidi Genocide by ISIS", countries: ["Iraq"], region: "West Asia", category: "Political Violence", start: 2014, end: 2015, deaths: "~5k killed; 7k enslaved", displaced: "~400k",
    note: "The Islamic State's assault on **Sinjar in northern Iraq on 3 August 2014** specifically targeted the Yazidi religious minority for extermination, on theological grounds articulated in ISIS publications that declared Yazidis polytheists outside the protections accorded to People of the Book. The **UN Independent International Commission of Inquiry**'s report *They Came to Destroy* in June 2016 found that ISIS actions constitute genocide. Approximately five thousand Yazidi men and elderly women were killed, seven thousand women and girls captured and subjected to sexual slavery in a systematic regional market, and four hundred thousand displaced. The **German Federal Court of Justice in November 2021** and other national jurisdictions have since prosecuted individuals for genocide on the basis of universal jurisdiction. Approximately 2,700 Yazidis remained missing as of 2024.",
    cites: [37] },
  { name: "Sednaya Prison and Assad Regime Detention", countries: ["Syria"], region: "West Asia", category: "Political Violence", start: 2011, end: 2024, deaths: "~30k+ in Sednaya alone", displaced: "subsumed in Syrian Civil War",
    note: "The Syrian regime's detention and torture facility system, of which **Sednaya prison** was the most notorious component, operated as a parallel infrastructure of state killing alongside the conventional civil war. The **Caesar Photographs**, smuggled by a Syrian military police photographer who defected in 2013 and released to international investigators in 2014, documented approximately 6,786 bodies of detainees killed in regime custody between 2011 and 2013 alone. The Syrian Network for Human Rights estimates approximately thirty thousand deaths in Sednaya prison alone, which **Amnesty International's 2017 report characterised as a human slaughterhouse**. The 8 December 2024 fall of the Assad regime opened Sednaya and revealed both the surviving detainees and the mass graves whose investigation under the transitional government continues.",
    cites: [7, 25] },
  { name: "2025 Syrian Coastal Massacres", countries: ["Syria"], region: "West Asia", category: "Political Violence", start: 2025, end: 2025, deaths: "~1.4k to 1.7k Alawites", displaced: "thousands fled coast",
    note: "Following pro-former-regime attacks on Hayat Tahrir al-Sham-led interim government forces on **6 March 2025** in the Latakia and Tartus governorates, government and allied factions, supplemented by foreign fighters identified as including individuals of Turkmen and Chechen origin, conducted reprisal killings against **Alawite communities** in the form of execution-style killings in homes, on rooftops, and at checkpoints across the Syrian coast. The Syrian Network for Human Rights documented 1,557 dead by 17 March, the Syrian Observatory placed the toll above 1,700, and the **Syrian National Inquiry Committee** confirmed the names of 1,426 dead including 90 women in its July 2025 report. The **UN Commission of Inquiry's August 2025 report** found that approximately 1,400 people, predominantly civilians, were killed and that the acts may amount to war crimes. The Inquiry Committee referred 298 alleged perpetrators from military factions and 265 from former regime-affiliated groups to the attorney general.",
    cites: [25, 34] },
];

// ============================================================
// CITATION — click-handler navigation (href fragment alone fails
// inside the artifact iframe; we intercept and scroll manually)
// ============================================================

function scrollToRef(n) {
  return (e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.getElementById('ref-' + n);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Brief highlight pulse so the eye can find the row
      const orig = el.style.backgroundColor;
      el.style.transition = 'background-color 0.3s ease';
      el.style.backgroundColor = 'rgba(184,149,106,0.25)';
      setTimeout(() => { el.style.backgroundColor = orig; }, 1200);
    }
  };
}

export function Cite({ ids }) {
  return (
    <sup style={{ fontSize: '0.7em', whiteSpace: 'nowrap', marginLeft: '1px' }}>
      {ids.map((n, i) => (
        <React.Fragment key={n}>
          {i > 0 && <span style={{ color: '#b8956a' }}>,</span>}
          <a href={'#ref-' + n} onClick={scrollToRef(n)} style={{
            color: '#b8956a',
            textDecoration: 'none',
            padding: '0 1px',
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          }}>{n}</a>
        </React.Fragment>
      ))}
    </sup>
  );
}

function renderBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#f1ead9', fontWeight: 500 }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ============================================================
// NUMERIC ESTIMATE PARSER
//
// The catalogue stores death and displacement figures as
// human-readable strings ("2 to 6 M", "~30k", "tens of thousands",
// "minimal"). To sum them across filtered events we parse each
// string into an approximate midpoint number.
//
// Rules:
//  - "minimal" or "subsumed" → 0 (we don't double-count linked events)
//  - "millions" → 1.5 M; "hundreds of thousands" → 500 k;
//    "tens of thousands" → 50 k; "thousands" → 5 k; "hundreds" → 500
//  - "X to Y unit"  →  midpoint, with the unit applied to the lower
//    number when it would otherwise be inconsistent (e.g. "2 to 6 M"
//    parses as 4 M, not as 2 + 3 M / 2). Ranges like "200 to 2k" stay
//    raw because the lower bound is already ≥ 100.
//  - Single numbers with k / M / B suffix are converted directly.
//
// Imprecision is acknowledged in the displayed label ("EST.").
// ============================================================

function parseEstimate(s) {
  if (!s || typeof s !== 'string') return 0;
  let txt = s.toLowerCase().replace(/[~+,]/g, ' ').trim();
  if (/^minimal\b/.test(txt) || /subsumed/.test(txt)) return 0;

  // Word-based magnitudes when no digits are present
  if (!/\d/.test(txt)) {
    if (/hundreds of millions/.test(txt)) return 500000000;
    if (/millions/.test(txt))             return 1500000;
    if (/hundreds of thousands/.test(txt))return 500000;
    if (/tens of thousands/.test(txt))    return 50000;
    if (/thousands/.test(txt))            return 5000;
    if (/hundreds/.test(txt))             return 500;
    return 0;
  }

  const mult = (c) => c === 'k' ? 1000 : c === 'm' ? 1000000 : c === 'b' ? 1000000000 : 1;

  // Range first: "lo[unit?] to hi[unit?]"
  const rangeRe = /(\d+(?:\.\d+)?)\s*([kmb])?\s*(?:to|-|–|—)\s*(\d+(?:\.\d+)?)\s*([kmb])?/i;
  const m = txt.match(rangeRe);
  if (m) {
    const lo = parseFloat(m[1]);
    const hi = parseFloat(m[3]);
    const loSuffix = (m[2] || '').toLowerCase();
    const hiSuffix = (m[4] || '').toLowerCase();
    // Apply hiSuffix to lo only when lo is small (< 100) and lacks its own suffix
    const effectiveLo = loSuffix || (hiSuffix && lo < 100 ? hiSuffix : '');
    return (lo * mult(effectiveLo) + hi * mult(hiSuffix)) / 2;
  }

  // Single number with optional unit
  const singleRe = /(\d+(?:\.\d+)?)\s*([kmb])?/i;
  const sm = txt.match(singleRe);
  if (sm) return parseFloat(sm[1]) * mult((sm[2] || '').toLowerCase());
  return 0;
}

function formatNumber(n) {
  if (!n || n === 0) return '0';
  if (n >= 1000000000) {
    const v = n / 1000000000;
    return (v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, '')) + ' B';
  }
  if (n >= 1000000) {
    const v = n / 1000000;
    return (v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, '')) + ' M';
  }
  if (n >= 1000) return Math.round(n / 1000) + ' k';
  return String(Math.round(n));
}

const COUNTRIES_BY_REGION = (() => {
  const out = {};
  Object.keys(REGIONS).forEach(r => { out[r] = []; });
  Object.entries(COUNTRY_REGION).forEach(([country, region]) => {
    if (out[region]) out[region].push(country);
  });
  Object.keys(out).forEach(r => out[r].sort());
  return out;
})();

const ALL_COUNTRIES = Object.keys(COUNTRY_REGION).sort();

// ============================================================
// TIMELINE COMPONENTS
// ============================================================

function YearTicks({ yearStart, yearEnd }) {
  const range = yearEnd - yearStart;
  const step = range > 60 ? 10 : range > 30 ? 5 : range > 10 ? 2 : 1;
  const marks = [];
  for (let y = Math.ceil(yearStart / step) * step; y <= yearEnd; y += step) marks.push(y);
  return (
    <div className="relative h-6 w-full">
      {marks.map((y) => (
        <div key={y} className="absolute top-0 h-full" style={{ left: ((y - yearStart) / range) * 100 + '%' }}>
          <div className="h-3 w-px" style={{ backgroundColor: 'rgba(232,226,212,0.18)' }} />
          <div className="mono text-[10px] -translate-x-1/2 mt-0.5" style={{ color: 'rgba(232,226,212,0.5)' }}>{y}</div>
        </div>
      ))}
    </div>
  );
}

function DecadeLines({ yearStart, yearEnd }) {
  const range = yearEnd - yearStart;
  const step = range > 60 ? 10 : range > 30 ? 5 : range > 10 ? 2 : 1;
  const marks = [];
  for (let y = Math.ceil(yearStart / step) * step; y <= yearEnd; y += step) marks.push(y);
  return (
    <>
      {marks.map((y) => (
        <div key={y} className="absolute top-0 bottom-0 w-px pointer-events-none"
          style={{ left: ((y - yearStart) / range) * 100 + '%', backgroundColor: 'rgba(232,226,212,0.06)' }} />
      ))}
    </>
  );
}

function EventRow({ ev, expanded, onToggle, yearStart, yearEnd }) {
  const r = REGIONS[ev.region];
  const range = yearEnd - yearStart;
  const evStart = Math.max(ev.start, yearStart);
  const evEnd = Math.min(ev.end, yearEnd);
  const left = ((evStart - yearStart) / range) * 100;
  const width = Math.max(((evEnd - evStart) / range) * 100, 0.6);
  const isPoint = ev.end === ev.start;
  const yearLabel = isPoint ? String(ev.start) : ev.start + ' to ' + ev.end;
  const isPV = ev.category === "Political Violence";

  return (
    <div className="group">
      <button onClick={onToggle} className="w-full text-left flex items-stretch gap-3 py-2"
        style={{ borderTop: '1px solid rgba(232,226,212,0.06)' }}>
        <div className="w-[44%] sm:w-[34%] shrink-0 pr-2">
          <div className="serif text-[14px] sm:text-[15px] leading-tight flex items-center gap-2 flex-wrap" style={{ color: '#e8e2d4' }}>
            {ev.name}
            {isPV && (
              <span className="mono text-[8px] px-1.5 py-0.5 rounded-sm" style={{
                color: '#0e1118', backgroundColor: r.color, opacity: 0.85, letterSpacing: '0.05em'
              }}>PV</span>
            )}
          </div>
          <div className="mono text-[10px] mt-0.5" style={{ color: 'rgba(232,226,212,0.45)' }}>{yearLabel}</div>
        </div>
        <div className="relative flex-1 min-h-[28px]">
          <DecadeLines yearStart={yearStart} yearEnd={yearEnd} />
          {isPV ? (
            <div className="absolute top-1/2 -translate-y-1/2 transition-all" style={{
              left: left + '%', width: width + '%',
              height: isPoint ? '10px' : '8px', minWidth: isPoint ? '6px' : '4px',
              backgroundImage: 'repeating-linear-gradient(45deg, ' + r.color + ' 0px, ' + r.color + ' 2px, transparent 2px, transparent 4px)',
              border: '1px solid ' + r.color, borderRadius: '2px',
              boxShadow: expanded ? '0 0 0 2px ' + r.ring : 'none',
            }} />
          ) : (
            <div className="absolute top-1/2 -translate-y-1/2 rounded-[2px] transition-all" style={{
              left: left + '%', width: width + '%',
              height: isPoint ? '10px' : '8px', minWidth: isPoint ? '6px' : '4px',
              backgroundColor: r.color,
              boxShadow: expanded ? '0 0 0 2px ' + r.ring : 'none',
            }} />
          )}
        </div>
      </button>

      {expanded && (
        <div className="pl-3 pr-2 pb-4 pt-2 text-[12.5px] leading-relaxed" style={{
          color: 'rgba(232,226,212,0.85)', borderLeft: '2px solid ' + r.color, marginLeft: '4px', marginBottom: '4px',
        }}>
          <div className="mono text-[10px] mb-3 flex flex-wrap gap-x-3 gap-y-1" style={{ color: 'rgba(232,226,212,0.6)' }}>
            <span>{ev.countries.join(' · ').toUpperCase()}</span>
            <span style={{ color: r.color }}>{ev.region.toUpperCase()}</span>
            <span>{ev.category.toUpperCase()}</span>
            <span>DEAD {ev.deaths}</span>
            <span>DISPLACED {ev.displaced}</span>
          </div>
          <div className="sans">
            {renderBold(ev.note)}
            {ev.cites && ev.cites.length > 0 && <> <Cite ids={ev.cites} /></>}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// YEAR RANGE SLIDER (dual-handle)
// ============================================================

function YearRangeSlider({ value, onChange }) {
  const [lo, hi] = value;
  const range = END_YEAR - START_YEAR;
  const pctLo = ((lo - START_YEAR) / range) * 100;
  const pctHi = ((hi - START_YEAR) / range) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div className="mono text-[10px] tracking-[0.2em]" style={{ color: 'rgba(232,226,212,0.55)' }}>YEAR RANGE</div>
        <div className="mono text-[11px]" style={{ color: '#b8956a' }}>{lo} to {hi}</div>
      </div>
      <div className="relative h-8 w-full">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] rounded"
             style={{ backgroundColor: 'rgba(232,226,212,0.15)' }} />
        <div className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded"
             style={{ left: pctLo + '%', width: (pctHi - pctLo) + '%', backgroundColor: '#b8956a' }} />
        <input type="range" min={START_YEAR} max={END_YEAR} value={lo}
          onChange={(e) => { const v = parseInt(e.target.value, 10); if (v < hi) onChange([v, hi]); }}
          className="year-slider absolute inset-0 w-full appearance-none bg-transparent"
          style={{ zIndex: 3, pointerEvents: 'none' }} />
        <input type="range" min={START_YEAR} max={END_YEAR} value={hi}
          onChange={(e) => { const v = parseInt(e.target.value, 10); if (v > lo) onChange([lo, v]); }}
          className="year-slider absolute inset-0 w-full appearance-none bg-transparent"
          style={{ zIndex: 4, pointerEvents: 'none' }} />
      </div>
      <style>{`
        .year-slider::-webkit-slider-thumb {
          pointer-events: auto; appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: #f1ead9; border: 2px solid #b8956a; cursor: pointer;
        }
        .year-slider::-moz-range-thumb {
          pointer-events: auto;
          width: 14px; height: 14px; border-radius: 50%;
          background: #f1ead9; border: 2px solid #b8956a; cursor: pointer;
        }
        .year-slider::-webkit-slider-runnable-track { background: transparent; }
        .year-slider::-moz-range-track { background: transparent; }
      `}</style>
    </div>
  );
}

// ============================================================
// MULTI-SELECT COUNTRY FILTER
// ============================================================

function CountryFilter({ active, onToggle, onSelectAll, onClearAll, onToggleRegion }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div className="mono text-[10px] tracking-[0.2em]" style={{ color: 'rgba(232,226,212,0.55)' }}>
          FILTER COUNTRIES · {active.size} of {ALL_COUNTRIES.length}
        </div>
        <div className="flex gap-2">
          <button onClick={onSelectAll} className="mono text-[10px] px-2 py-0.5 rounded"
            style={{ color: '#b8956a', border: '1px solid rgba(184,149,106,0.35)' }}>ALL</button>
          <button onClick={onClearAll} className="mono text-[10px] px-2 py-0.5 rounded"
            style={{ color: 'rgba(232,226,212,0.5)', border: '1px solid rgba(232,226,212,0.15)' }}>NONE</button>
        </div>
      </div>
      <div className="space-y-2">
        {Object.entries(COUNTRIES_BY_REGION).map(([region, countries]) => {
          const r = REGIONS[region];
          return (
            <div key={region}>
              <button onClick={() => onToggleRegion(region)}
                className="mono text-[10px] tracking-[0.15em] mb-1.5 cursor-pointer"
                style={{ color: r.color }}>
                {region.toUpperCase()} •
              </button>
              <div className="flex flex-wrap gap-1.5">
                {countries.map(c => {
                  const on = active.has(c);
                  return (
                    <button key={c} onClick={() => onToggle(c)}
                      className="sans text-[11px] px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: on ? r.soft : 'transparent',
                        color: on ? '#f1ead9' : 'rgba(232,226,212,0.4)',
                        border: '1px solid ' + (on ? r.ring : 'rgba(232,226,212,0.15)'),
                      }}>{c}</button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// PART II — EXCEPTIONS DATA + VISUALISATIONS
//
// The six countries with no armed-conflict and no political-violence
// entries in this catalogue. Bhutan, Maldives, and Uzbekistan are
// NOT included here: each has at least one entry in the timeline
// (Lhotshampa Expulsion, the 1988 coup attempt, the Andijan massacre
// and the 2010 Kyrgyz-Uzbek violence respectively).
// ============================================================

const EXCEPTIONS = [
  { country: "Japan",        region: "East Asia",      population: "~125 M", reason: "Constitutional alliance" },
  { country: "Mongolia",     region: "East Asia",      population: "~3 M",   reason: "Geographic buffer" },
  { country: "Singapore",    region: "Southeast Asia", population: "~5.5 M", reason: "Small sheltered economy" },
  { country: "Brunei",       region: "Southeast Asia", population: "~450k",  reason: "Small sheltered economy" },
  { country: "Kazakhstan",   region: "Central Asia",   population: "~20 M",  reason: "Geographic buffer" },
  { country: "Turkmenistan", region: "Central Asia",   population: "~6 M",   reason: "Geographic buffer" },
];

const ARCHETYPES = [
  {
    name: "Constitutional Alliance",
    mechanism: "Article 9 renunciation combined with an external security treaty that delegates the defence function.",
    countries: ["Japan"],
  },
  {
    name: "Geographic Buffer",
    mechanism: "Position between major powers whose direct confrontation would not be resolved by absorbing the buffer state, combined with alignment to the regional security provider.",
    countries: ["Mongolia", "Kazakhstan", "Turkmenistan"],
  },
  {
    name: "Small Sheltered Economy",
    mechanism: "Smallness sufficient to remove the state from major-power calculation, combined with trade integration that substitutes commercial weight for military projection.",
    countries: ["Singapore", "Brunei"],
  },
];

function ExceptionsTable() {
  return (
    <div className="my-6 border-y py-4" style={{ borderColor: 'rgba(232,226,212,0.12)' }}>
      <div className="mono text-[10px] tracking-[0.1em] mb-4" style={{ color: 'rgba(232,226,212,0.55)' }}>
        THE SIX EXCEPTIONS · NO ARMED CONFLICT · NO POLITICAL MASS VIOLENCE
      </div>
      <div className="space-y-3">
        {EXCEPTIONS.map(row => {
          const r = REGIONS[row.region];
          return (
            <div key={row.country}
              className="flex flex-wrap items-baseline gap-x-5 gap-y-1 pb-2"
              style={{ borderBottom: '1px solid rgba(232,226,212,0.06)' }}>
              <div className="flex items-center gap-2" style={{ minWidth: '120px' }}>
                <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                <span className="mono text-[9px] tracking-wider" style={{ color: 'rgba(232,226,212,0.5)' }}>
                  {row.region.toUpperCase()}
                </span>
              </div>
              <div className="serif text-[15px] sm:text-[17px]" style={{ color: '#f1ead9', minWidth: '110px' }}>
                {row.country}
              </div>
              <div className="mono text-[11px]" style={{ color: 'rgba(232,226,212,0.7)', minWidth: '70px' }}>
                {row.population}
              </div>
              <div className="sans text-[12px] sm:text-[13px] italic flex-1" style={{ color: 'rgba(232,226,212,0.8)' }}>
                {row.reason}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ArchetypesDiagram() {
  const accents = ['#c4615d', '#9683b8', '#5a8a85'];
  return (
    <div className="my-6">
      <div className="mono text-[10px] tracking-[0.1em] mb-4" style={{ color: 'rgba(232,226,212,0.55)' }}>
        THREE PATHS TO PEACE · ONE CATEGORY PER COUNTRY
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {ARCHETYPES.map((a, i) => {
          const accent = accents[i];
          return (
            <div key={a.name}
              className="p-4 sm:p-5 rounded flex flex-col"
              style={{ border: '1px solid ' + accent, backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <div className="mono text-[10px] tracking-[0.18em] mb-2" style={{ color: accent }}>
                PATH {i + 1}
              </div>
              <h4 className="serif font-medium mb-3"
                style={{ color: '#f1ead9', fontSize: '20px', lineHeight: 1.15 }}>
                {a.name}
              </h4>
              <div className="w-12 h-px mb-3" style={{ backgroundColor: accent, opacity: 0.5 }} />
              <p className="sans text-[13px] leading-relaxed mb-5 flex-1"
                style={{ color: 'rgba(232,226,212,0.78)' }}>
                {a.mechanism}
              </p>
              <div className="mono text-[10px] tracking-[0.15em] mb-1.5"
                style={{ color: 'rgba(232,226,212,0.5)' }}>
                COUNTRIES
              </div>
              <ul className="serif text-[15px] space-y-0.5" style={{ color: '#f1ead9' }}>
                {a.countries.map(c => <li key={c}>{c}</li>)}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// PART III · imperial-circuit diagram
// ============================================================

function ImperialCircuitDiagram() {
  const phases = [
    { label: "MECHANISM 1 · 1850 to 1945", color: "#c69449", title: "Imperial labor extraction",
      desc: "Railways, Gold Rush, plantations, annexation, indenture." },
    { label: "MECHANISM 2 · 1945 to present", color: "#c4615d", title: "Violent decolonization",
      desc: "Partition, Indochina, Korea, Vietnam, Palestine, Iraq." },
    { label: "MECHANISM 3 · 1965 to present", color: "#5a8a85", title: "Refugee production and immigration reform",
      desc: "1965 US Hart-Celler; 1967 Canada points system." },
  ];
  return (
    <div className="my-8">
      <div className="mono text-[10px] tracking-[0.1em] mb-4" style={{ color: 'rgba(232,226,212,0.55)' }}>
        THREE MECHANISMS · LABOR EXTRACTION TO DISPLACEMENT TO ARRIVAL
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {phases.map((p, i) => (
          <div key={i} className="p-4 sm:p-5 rounded" style={{ border: '1px solid ' + p.color }}>
            <div className="mono text-[10px] tracking-[0.1em] mb-2" style={{ color: p.color }}>
              {p.label}
            </div>
            <div className="serif text-[17px] sm:text-[18px] mb-2" style={{ color: '#f1ead9', lineHeight: 1.2 }}>
              {p.title}
            </div>
            <div className="sans text-[12px] sm:text-[13px] leading-relaxed" style={{ color: 'rgba(232,226,212,0.72)' }}>
              {p.desc}
            </div>
          </div>
        ))}
      </div>
      <p className="serif italic text-center text-[15px] sm:text-[17px] leading-snug max-w-2xl mx-auto"
        style={{ color: '#f1ead9' }}>
        The arrival the heritage month celebrates is the same event as the departure each war produced.
      </p>
    </div>
  );
}

// ============================================================
// SUBSECTION HEADING — small monospace eyebrow + serif title.
// Replaces the ugly "II.A", "III.B" prefix style.
// ============================================================

function SubsectionHeading({ eyebrow, title }) {
  return (
    <div className="mt-10 mb-3">
      {eyebrow && (
        <div className="mono text-[10px] tracking-[0.25em] mb-1.5" style={{ color: 'rgba(184,149,106,0.85)' }}>
          {eyebrow}
        </div>
      )}
      <h3 className="serif" style={{ color: '#f1ead9', fontSize: '22px', lineHeight: 1.15, fontWeight: 500 }}>
        {title}
      </h3>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AsiaViolenceTimeline() {
  const [activeCountries, setActiveCountries] = useState(new Set(ALL_COUNTRIES));
  const [activeCategory, setActiveCategory] = useState("Both");
  const [groupBy, setGroupBy] = useState("region");
  const [yearRange, setYearRange] = useState([START_YEAR, END_YEAR]);
  const [expanded, setExpanded] = useState(null);

  const toggleCountry = (c) => {
    const n = new Set(activeCountries);
    if (n.has(c)) n.delete(c); else n.add(c);
    setActiveCountries(n);
  };
  const selectAllCountries = () => setActiveCountries(new Set(ALL_COUNTRIES));
  const clearAllCountries = () => setActiveCountries(new Set());
  const toggleRegionCountries = (region) => {
    const inRegion = COUNTRIES_BY_REGION[region] || [];
    const allOn = inRegion.every(c => activeCountries.has(c));
    const n = new Set(activeCountries);
    if (allOn) inRegion.forEach(c => n.delete(c));
    else inRegion.forEach(c => n.add(c));
    setActiveCountries(n);
  };

  const [yearStart, yearEnd] = yearRange;

  const filteredEvents = useMemo(() => {
    return EVENTS.filter(e =>
      e.countries.some(c => activeCountries.has(c)) &&
      (activeCategory === "Both" ||
       (activeCategory === "Armed Conflict" && e.category === "Armed Conflict") ||
       (activeCategory === "Political Violence" && e.category === "Political Violence")) &&
      e.start <= yearEnd && e.end >= yearStart
    );
  }, [activeCountries, activeCategory, yearStart, yearEnd]);

  const groupedByRegion = useMemo(() => {
    const o = {};
    Object.keys(REGIONS).forEach(r => {
      o[r] = filteredEvents.filter(e => e.region === r).sort((a, b) => a.start - b.start || a.end - b.end);
    });
    return o;
  }, [filteredEvents]);

  const groupedByCountry = useMemo(() => {
    const countries = {};
    filteredEvents.forEach(e => {
      e.countries.forEach(c => {
        if (activeCountries.has(c)) {
          if (!countries[c]) countries[c] = { events: [], region: COUNTRY_REGION[c] || e.region };
          countries[c].events.push(e);
        }
      });
    });
    Object.keys(countries).forEach(c => {
      countries[c].events.sort((a, b) => a.start - b.start || a.end - b.end);
    });
    const sortedKeys = Object.keys(countries).sort();
    const result = {};
    sortedKeys.forEach(k => result[k] = countries[k]);
    return result;
  }, [filteredEvents, activeCountries]);

  const total = filteredEvents.length;
  const armed = filteredEvents.filter(e => e.category === "Armed Conflict").length;
  const pv = filteredEvents.filter(e => e.category === "Political Violence").length;
  const ongoing = filteredEvents.filter(e => e.end >= 2026).length;
  const totalDeaths = filteredEvents.reduce((s, e) => s + parseEstimate(e.deaths), 0);
  const totalDisplaced = filteredEvents.reduce((s, e) => s + parseEstimate(e.displaced), 0);

  // Heading scale — strictly descending from h1 to h3
  // h1: 52px desktop / 34px mobile
  // h2 (Parts): 32px desktop / 26px mobile  ← tightened from 38px to ensure h1 dominates
  // h3 (subsections): 22px ← set in SubsectionHeading above

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#0e1118', color: '#e8e2d4' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@300;400&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sans  { font-family: 'DM Sans', system-ui, sans-serif; }
        .mono  { font-family: 'JetBrains Mono', ui-monospace, monospace; letter-spacing: 0.02em; }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 relative">
        {/* HEADER */}
        <header className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="mono text-[10px] tracking-[0.3em]" style={{ color: '#b8956a' }}>
              ASIA · 1945 TO 2026 · CONFLICT AND STATE VIOLENCE
            </div>
            <a href="?view=convergence" className="mono text-[10px] tracking-[0.2em] px-3 py-1.5 rounded-full"
              style={{
                color: '#b8956a',
                border: '1px solid rgba(184,149,106,0.45)',
                textDecoration: 'none',
                backgroundColor: 'rgba(184,149,106,0.06)',
              }}>
              TRY CONVERGENCE VIEW →
            </a>
          </div>
          <h1 className="serif font-medium mb-3" style={{ color: '#f1ead9', fontSize: 'clamp(34px, 6vw, 52px)', lineHeight: 0.95 }}>
            After <span style={{ fontStyle: 'italic', color: '#b8956a' }}>Empire</span>
          </h1>
          <p className="serif italic mb-7 max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)', fontSize: 'clamp(17px, 2.4vw, 22px)', lineHeight: 1.3 }}>
            Asia, Violence, and the Histories Behind Asian Heritage Month (1945&#x2013;2026)
          </p>
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              Asian Heritage Month is often organized around migration, contribution, resilience, and belonging. This project begins slightly earlier, with the historical conditions that made many migrations necessary in the first place.
            </p>
            <p>
              The timeline starts in 1945 because the end of the Second World War marked a fundamental rupture in modern Asian history.<Cite ids={[45]}/> The collapse of the Japanese Empire, the weakening of European colonial powers, the beginning of the Cold War, the acceleration of decolonization, and the creation of the postwar international order transformed Asia more rapidly and violently than perhaps any other region in the world during the second half of the twentieth century.<Cite ids={[57, 58]}/>
            </p>
            <p>
              Many of the political realities that continue to shape contemporary Asia &#x2014; the division of Korea, the Partition of India, the Chinese Civil War, the Vietnam Wars, the Arab&#x2013;Israeli conflict, postcolonial border disputes, Cold War proxy struggles, refugee movements, and the emergence of modern Asian diasporas in North America &#x2014; either began directly after 1945 or were fundamentally reshaped by the postwar order that emerged from it.<Cite ids={[45, 46]}/>
            </p>
            <p>
              Since then, Asia has experienced successive waves of interstate war, civil war, occupation, insurgency, dictatorship, political repression, forced displacement, and mass violence. Some of these events became central to international historical memory. Others remained fragmented across diasporas, survivor communities, family histories, and local archives.
            </p>
            <p>
              This project gathers interstate wars, occupations, insurgencies, politicide, ethnic cleansing, state repression, detention systems, and campaigns of mass political violence across Asia from 1945 to 2026. Solid bars represent armed conflict. Patterned bars represent large-scale political repression, state terror, forced displacement, or mass violence directed primarily against civilian populations.<Cite ids={[1, 2, 3, 60, 61, 62]}/>
            </p>
            <p>
              The categories are necessarily imperfect. Many events move across the boundary between war and state violence. Casualty figures likewise remain contested. The estimates presented throughout are drawn from academic literature, institutional datasets, demographic studies, legal investigations, and historical scholarship, and should be read as historical approximations rather than definitive totals.<Cite ids={[47]}/>
            </p>
            <p>
              This project does not argue that Asia can be reduced to violence. It argues that many contemporary Asian diasporas &#x2014; including those celebrated each May in Canada and the United States &#x2014; emerged within a broader historical landscape shaped by empire, decolonization, Cold War rivalry, migration, and displacement.
            </p>
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-5 mb-6 sm:mb-8 py-4 border-y" style={{ borderColor: 'rgba(232,226,212,0.12)' }}>
          <div>
            <div className="serif text-[24px] sm:text-[28px] leading-none" style={{ color: '#f1ead9' }}>{total}</div>
            <div className="mono text-[9px] sm:text-[10px] mt-1 tracking-wider" style={{ color: 'rgba(232,226,212,0.55)' }}>EVENTS</div>
          </div>
          <div>
            <div className="serif text-[24px] sm:text-[28px] leading-none" style={{ color: '#f1ead9' }}>{armed} / {pv}</div>
            <div className="mono text-[9px] sm:text-[10px] mt-1 tracking-wider" style={{ color: 'rgba(232,226,212,0.55)' }}>ARMED / POLITICAL</div>
          </div>
          <div>
            <div className="serif text-[24px] sm:text-[28px] leading-none" style={{ color: '#f1ead9' }}>~{formatNumber(totalDeaths)}</div>
            <div className="mono text-[9px] sm:text-[10px] mt-1 tracking-wider" style={{ color: 'rgba(232,226,212,0.55)' }}>EST. DEAD</div>
          </div>
          <div>
            <div className="serif text-[24px] sm:text-[28px] leading-none" style={{ color: '#f1ead9' }}>~{formatNumber(totalDisplaced)}</div>
            <div className="mono text-[9px] sm:text-[10px] mt-1 tracking-wider" style={{ color: 'rgba(232,226,212,0.55)' }}>EST. DISPLACED</div>
          </div>
          <div>
            <div className="serif text-[24px] sm:text-[28px] leading-none" style={{ color: '#f1ead9' }}>{ongoing}</div>
            <div className="mono text-[9px] sm:text-[10px] mt-1 tracking-wider" style={{ color: 'rgba(232,226,212,0.55)' }}>ACTIVE IN 2026</div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="mb-8 space-y-6">
          <YearRangeSlider value={yearRange} onChange={setYearRange} />

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className="mono text-[10px] tracking-[0.2em] mb-2" style={{ color: 'rgba(232,226,212,0.55)' }}>CATEGORY</div>
              <div className="flex flex-wrap gap-2">
                {["Both", "Armed Conflict", "Political Violence"].map(cat => {
                  const on = activeCategory === cat;
                  return (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className="sans text-[12px] px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: on ? 'rgba(184,149,106,0.16)' : 'transparent',
                        color: on ? '#f1ead9' : 'rgba(232,226,212,0.4)',
                        border: '1px solid ' + (on ? 'rgba(184,149,106,0.45)' : 'rgba(232,226,212,0.15)'),
                      }}>{cat}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="mono text-[10px] tracking-[0.2em] mb-2" style={{ color: 'rgba(232,226,212,0.55)' }}>GROUP BY</div>
              <div className="flex flex-wrap gap-2">
                {[{k: "region", l: "Region"}, {k: "country", l: "Country"}].map(g => {
                  const on = groupBy === g.k;
                  return (
                    <button key={g.k} onClick={() => setGroupBy(g.k)}
                      className="sans text-[12px] px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: on ? 'rgba(184,149,106,0.16)' : 'transparent',
                        color: on ? '#f1ead9' : 'rgba(232,226,212,0.4)',
                        border: '1px solid ' + (on ? 'rgba(184,149,106,0.45)' : 'rgba(232,226,212,0.15)'),
                      }}>{g.l}</button>
                  );
                })}
              </div>
            </div>
          </div>

          <CountryFilter
            active={activeCountries}
            onToggle={toggleCountry}
            onSelectAll={selectAllCountries}
            onClearAll={clearAllCountries}
            onToggleRegion={toggleRegionCountries}
          />
        </div>

        {/* TIMELINE */}
        {total === 0 ? (
          <div className="py-12 text-center mono text-[12px]" style={{ color: 'rgba(232,226,212,0.5)' }}>
            No events match the current filters.
          </div>
        ) : groupBy === "region" ? (
          <div className="space-y-10">
            {Object.entries(groupedByRegion).map(([region, events]) => {
              if (events.length === 0) return null;
              const r = REGIONS[region];
              return (
                <section key={region}>
                  <div className="flex items-baseline justify-between mb-3 pb-2" style={{ borderBottom: '1px solid ' + r.ring }}>
                    <h2 className="serif" style={{ color: r.color, fontSize: 'clamp(20px, 3vw, 26px)' }}>{region}</h2>
                    <span className="mono text-[10px]" style={{ color: 'rgba(232,226,212,0.45)' }}>{events.length} {events.length === 1 ? 'event' : 'events'}</span>
                  </div>
                  <div className="flex gap-3 mb-1">
                    <div className="w-[44%] sm:w-[34%] shrink-0" />
                    <div className="flex-1"><YearTicks yearStart={yearStart} yearEnd={yearEnd} /></div>
                  </div>
                  <div>
                    {events.map(e => {
                      const key = e.name + '-' + e.start;
                      return <EventRow key={key} ev={e} expanded={expanded === key} onToggle={() => setExpanded(expanded === key ? null : key)} yearStart={yearStart} yearEnd={yearEnd} />;
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedByCountry).map(([country, data]) => {
              const r = REGIONS[data.region];
              return (
                <section key={country}>
                  <div className="flex items-baseline justify-between mb-3 pb-2" style={{ borderBottom: '1px solid ' + r.ring }}>
                    <h2 className="serif" style={{ color: r.color, fontSize: 'clamp(20px, 3vw, 26px)' }}>{country}</h2>
                    <span className="mono text-[10px]" style={{ color: 'rgba(232,226,212,0.45)' }}>{data.region.toUpperCase()} · {data.events.length} {data.events.length === 1 ? 'event' : 'events'}</span>
                  </div>
                  <div className="flex gap-3 mb-1">
                    <div className="w-[44%] sm:w-[34%] shrink-0" />
                    <div className="flex-1"><YearTicks yearStart={yearStart} yearEnd={yearEnd} /></div>
                  </div>
                  <div>
                    {data.events.map(e => {
                      const key = e.name + '-' + e.start + '-' + country;
                      return <EventRow key={key} ev={e} expanded={expanded === key} onToggle={() => setExpanded(expanded === key ? null : key)} yearStart={yearStart} yearEnd={yearEnd} />;
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/* PART II                                                         */}
        {/* ============================================================ */}
        <section className="mt-20 sm:mt-24">
          <div className="mono text-[10px] tracking-[0.3em] mb-3" style={{ color: '#b8956a' }}>PART II</div>
          <h2 className="serif font-medium mb-6" style={{ color: '#f1ead9', fontSize: 'clamp(26px, 4vw, 32px)', lineHeight: 1.1 }}>
            The Conditions of Peace
          </h2>

          <SubsectionHeading eyebrow="GEOGRAPHY" title="Security, geography, and the uneven distribution of stability" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              One of the clearest patterns visible across postwar Asia is not simply the recurrence of violence, but its uneven distribution. Across the eighty years recorded in this timeline, large parts of the continent moved through repeated cycles of war, partition, insurgency, occupation, dictatorship, and political repression. Yet a small number of states have no entry in the catalogue under either the armed-conflict or the political mass violence classification. Six countries belong to this group: <strong style={{ color: '#f1ead9' }}>Japan, Mongolia, Singapore, Brunei, Kazakhstan, and Turkmenistan</strong>.
            </p>
            <p>
              The list is shorter than the popular narrative usually suggests. Bhutan is sometimes named informally as a model of peace, particularly in tourism literature and in some summary comparative-politics accounts. The historical record does not sustain the claim. Between 1990 and 1993, the Bhutanese state's <em>One Nation, One People</em> policy and the 1985 Citizenship Act produced a campaign that forcibly displaced approximately 108,000 ethnic Nepali Lhotshampa, documented by Human Rights Watch as ethnic cleansing.<Cite ids={[59]}/> The Maldives appears in the catalogue for the 1988 coup attempt. Uzbekistan appears for the 2005 Andijan massacre and the 2010 Kyrgyz-Uzbek violence. The six genuine exceptions are clarifying precisely because the list is short.
            </p>
          </div>

          <ExceptionsTable />

          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl mt-2" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              The significance of these cases lies less in any inherent cultural disposition toward peace than in the structural conditions that made relative stability possible. The absence of major war did not necessarily imply liberal democracy, political openness, or equality. Singapore combined stability with highly securitized governance and extensive restrictions on opposition politics.<Cite ids={[48]}/> Mongolia remained deeply constrained by Soviet influence throughout much of the Cold War.<Cite ids={[49]}/> Postwar Japan developed under extensive American military protection despite constitutional restrictions on warfare.<Cite ids={[50]}/> The central question is therefore not why some Asian societies were naturally peaceful, but how peace itself became historically sustainable under particular geopolitical conditions.
            </p>
          </div>

          <SubsectionHeading eyebrow="QUALIFICATION" title="A note on Singapore" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              The early years of Singapore's modern statehood were not, in fact, free of organized violence. The communal riots of July and September 1964 produced approximately thirty-six deaths and more than five hundred injuries on the island. The Indonesia&#x2013;Malaysia Confrontation (Konfrontasi, 1963 to 1966) brought direct attacks on Singapore, including the MacDonald House bombing of March 10, 1965, which killed three civilians and wounded thirty-three. What the catalogue records, and what the comparative-politics literature largely identifies as the <em>Singaporean peace</em>, is the period after independence in August 1965, during which the post-separation Singaporean state has experienced no significant internal armed conflict or large-scale political violence. The earlier turbulence is part of the same history as the later stability; the stability did not erase what came before it, and an honest framing of Singapore as an exception requires this qualification.
            </p>
          </div>

          <SubsectionHeading eyebrow="THREE PATHS" title="Three paths to peace" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              The six cases divide cleanly into three archetypes rather than into a checklist of overlapping conditions. Each country fits exactly one archetype. The typology is more analytically useful than a count of which structural conditions any given country exhibits, partly because the cases are too few for cumulative conditions to discriminate among them, and partly because the underlying mechanisms differ in kind, not merely in degree.
            </p>
          </div>

          <ArchetypesDiagram />

          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl mt-2" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              <strong style={{ color: '#f1ead9' }}>Constitutional alliance.</strong> Japan is the only case in this archetype. Article 9 of the 1947 Constitution constitutes the explicit renunciation of war as a sovereign right; the 1960 Treaty of Mutual Cooperation and Security between the United States and Japan constitutes the implicit subcontract through which the defense function was delegated.<Cite ids={[52, 53]}/> The combination was unusual then, and it remains unusual now. Every other Asian state with comparable industrial weight retained military projection as a sovereign function. Japan delegated it. John Dower's <em>Embracing Defeat</em> traces the immediate postwar conditions under which the delegation was institutionalized &#x2014; the dense interweaving of American occupation policy with Japanese reform politics, and the way in which a defeated, devastated society negotiated the terms of its own reconstruction under foreign supervision.<Cite ids={[50]}/> Chalmers Johnson's <em>MITI and the Japanese Miracle</em> documents the developmental architecture that grew within the security shadow this arrangement provided, and the way that architecture produced the postwar Japanese economy in something close to its present form.<Cite ids={[51]}/> The resulting peace was real. It was not, in any straightforward sense, a peace of Japan's own unilateral making.
            </p>
            <p>
              <strong style={{ color: '#f1ead9' }}>Geographic buffer.</strong> Mongolia, Kazakhstan, and Turkmenistan occupy this archetype. Each sits between major powers whose direct confrontation across the territory would not, on calculation, be resolved by absorbing the buffer state, and each pairs that geographic position with alignment to the regional security provider. Mongolia held a Soviet-aligned posture through 1990 and a balanced one since, on the long arc that Morris Rossabi traces from khans through commissars to capitalists.<Cite ids={[49]}/> Kazakhstan and Turkmenistan emerged from the Soviet dissolution into a regional system in which Russia retained the principal security role and the new states retained the option of close economic ties to China and the West simultaneously. The buffer logic has held, so far, in all three cases. A qualification is required: authoritarian opacity in Kazakhstan and Turkmenistan means their inclusion among the exceptions depends on the absence of <em>documented</em> mass violence rather than on the <em>proven absence</em> of mass violence. The classification is the most defensible one available, but it is a classification under epistemic constraint, and readers are asked to keep this in view.
            </p>
            <p>
              <strong style={{ color: '#f1ead9' }}>Small sheltered economy.</strong> Singapore and Brunei share this archetype. Both are small enough that their absorption into a major-power calculation would yield little relative to its cost. Both maintain functional security relationships &#x2014; Singapore through ASEAN, an active citizen army, and the Five Power Defence Arrangements with the United Kingdom, Australia, New Zealand, and Malaysia; Brunei through residual British arrangements that survived its 1984 independence. Both run economies whose returns from trade integration substantially exceed any plausible returns from territorial assertion. Meredith Weiss's <em>The Roots of Resilience</em>, published by Cornell University Press in 2020, frames Singapore &#x2014; together with Malaysia &#x2014; as an electoral-authoritarian hybrid regime in which authoritarian acculturation, patronage, and the depth of party-state grassroots machines sustain regime durability across successive cycles of contestation.<Cite ids={[48]}/> Brunei's smallness and the longevity of its dynastic-monarchical arrangements have, in their own way, produced an equivalent insulation.
            </p>
          </div>

          <SubsectionHeading eyebrow="DEBATE" title="Frameworks in dialogue" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              It should be acknowledged that the framework presented here &#x2014; peace as a function of external security architecture, strategic insulation, and the geopolitical calculations of larger actors &#x2014; is not the only academic framework available, and that other scholars have weighted the causes differently. Timo Kivim&#xE4;ki and Stein T&#xF8;nnesson have argued, in extended work, for what they call a <em>developmental peace</em> in East Asia: a regional shift in elite priorities toward economic development over warfare, supported by ASEAN's principle of non-intervention, by the prioritization of welfare over warfare in the major Asian capitalist economies, and by what they have called an <em>ASEAN/Chinese Way</em> of conducting interstate relations. The two frameworks are not mutually exclusive. Developmental priorities flourish under external security guarantees, and security guarantees are sustained in part by the resulting economic interdependence. But the frameworks emphasize different causal mechanisms, and the one offered here weights the structural-geopolitical mechanism more heavily &#x2014; while acknowledging that the developmental-peace argument captures something real about how peace was reproduced, year over year, once the structural conditions were in place.
            </p>
          </div>

          <SubsectionHeading eyebrow="SYNTHESIS" title="What produces peace" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p style={{ color: '#f1ead9' }}>
              The pattern that emerges across all six cases is consistent. Peace in Asia since 1945 has rarely been a matter of unilateral domestic choice. It has required occupying one of three positions in which the cost of violence to a larger actor exceeds the benefit &#x2014; and the larger actor's calculation has done a great deal of the work that the smaller state's domestic politics is sometimes credited with. This is not a counsel of fatalism, and it is not an argument that peaceful states have no agency. It is a recognition that the small number of peaceful trajectories in postwar Asia rests on conditions that were not, in their origins, of those states' own unilateral making. Where these conditions held, peace held with them. Where they did not, peace did not.
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PART III                                                        */}
        {/* ============================================================ */}
        <section className="mt-20 sm:mt-24">
          <div className="mono text-[10px] tracking-[0.3em] mb-3" style={{ color: '#b8956a' }}>PART III</div>
          <h2 className="serif font-medium mb-6" style={{ color: '#f1ead9', fontSize: 'clamp(26px, 4vw, 32px)', lineHeight: 1.1 }}>
            Empire, Migration, and Memory
          </h2>

          <SubsectionHeading eyebrow="OPENING" title="Imperialism, conflict, and the histories behind Heritage Month" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              The relationship between the conflicts represented in this timeline and the communities commemorated each May in Canada and the United States runs through a broader historical circuit linking empire, labor, war, migration, exclusion, and memory. This is not a relationship that the Heritage Month commemorations typically name in their official iterations. Yet much of what is being commemorated only exists because of what came before it.
            </p>
            <p>
              Asian Heritage Month itself emerged comparatively recently, and through specific bureaucratic instruments. In the United States, Asian/Pacific American Heritage Week was established by Public Law 95-419, signed by President Jimmy Carter on October 5, 1978. The legislation followed sustained advocacy by Capitol Hill staffers Jeanie Jew and Ruby Moy, and joint sponsorship by Representatives Frank Horton and Norman Mineta in the House and Senators Daniel Inouye and Spark Matsunaga in the Senate. Jew was motivated, in significant part, by the memory of her grandfather, a Chinese American railroad worker who had been killed amid anti-Asian violence in the late nineteenth century. The legislative motive was, in a literal sense, genealogical.<Cite ids={[63]}/>
            </p>
            <p>
              May was selected partly to commemorate the arrival of the first recorded Japanese resident of the United States in May 1843 and the completion of the Transcontinental Railroad in May 1869, built in its western portion through the labor of Chinese migrants under conditions of racial exclusion and recurrent anti-Asian violence.<Cite ids={[54]}/> President George H.W. Bush expanded the observance from a week to a month in 1990, with year-by-year reauthorization through 1991. Public Law 102-450, signed by Bush on October 28, 1992, made the month-long designation permanent.<Cite ids={[63]}/>
            </p>
            <p>
              Canada institutionalized the commemoration considerably later. Community-level observances existed throughout the 1990s, but formal federal recognition followed a December 2001 motion in the Senate by Vivienne Poy, the first Canadian senator of Asian ancestry. The Government of Canada formally designated May as Asian Heritage Month in May 2002.<Cite ids={[64, 65]}/>
            </p>
            <p>
              The timing is historically revealing. By the moment these commemorations became institutionalized, Asian communities had already spent more than a century shaping North American economies while simultaneously living through exclusion laws, racial segregation, internment, immigration restriction, anti-Asian violence, Cold War suspicion, and refugee displacement.<Cite ids={[55]}/>
            </p>
          </div>

          <ImperialCircuitDiagram />

          <SubsectionHeading eyebrow="MECHANISM ONE" title="The first mechanism: imperial labor extraction" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              The first historical mechanism connecting Asia to North America was imperial labor extraction. Chinese migration accelerated through railway construction, mining economies, plantation systems, and the Gold Rush labor markets of the nineteenth century. Stanford's Chinese Railroad Workers in North America Project estimates that fifteen to twenty thousand Chinese migrants laid the tracks of the western Central Pacific portion of the Transcontinental Railroad, completed at Promontory Summit in Utah on May 10, 1869. (The eastward Union Pacific track was built largely by Irish, German, and other European immigrants, by formerly enslaved Black workers, and by Mormon contractors.) South Asian migration to North America emerged from the British imperial labor circuits that moved Indian workers across the empire and across the Pacific world. Filipino migration expanded under American colonial rule after the annexation of the Philippines in 1898. Japanese migration to Hawai&#x2018;i and the Pacific coast developed through plantation recruitment systems tied to expanding imperial-commercial networks. The first recorded Japanese resident in the United States, Manjiro Nakahama, arrived at New Bedford on May 6, 1843, on the whaling vessel that had rescued him from a shipwreck; federal commemorative materials use May 7.<Cite ids={[54]}/>
            </p>
            <p>
              Asian migration to North America did not emerge through abstract multicultural openness. It developed within systems of empire, labor demand, extraction, and racial hierarchy. Lisa Lowe's <em>Immigrant Acts</em> analyzes these circuits as constitutive of the racial economic foundation of the United States, not as incidental to it.<Cite ids={[55]}/>
            </p>
          </div>

          <SubsectionHeading eyebrow="MECHANISM TWO" title="The second mechanism: violent decolonization" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              The second mechanism was violent decolonization. A striking proportion of the conflicts represented in this timeline trace directly to imperial dissolution and to the borders, populations, and unresolved questions that imperial powers left behind.
            </p>
            <p>
              The Partition of British India in 1947 produced one of the largest forced migrations of the twentieth century, with between one and two million dead and approximately fourteen to eighteen million displaced. It established the underlying structure of the Kashmir conflict, the Indo-Pakistani wars, and eventually the Bangladesh Liberation War of 1971.<Cite ids={[18, 44]}/> The French withdrawal from Indochina fed sequentially into the wars in Vietnam, Laos, and Cambodia. The Dutch departure from the East Indies preceded the Indonesian National Revolution and the later conflicts over West Papua and East Timor.<Cite ids={[22]}/> The end of the British Mandate for Palestine inaugurated a sequence of regional wars whose consequences continue to define the present. Iraq's contested borders, drawn by the British in the aftermath of the Ottoman collapse, sit at the origin of both Gulf wars and of the unresolved Kurdish question.
            </p>
            <p>
              The Cold War overlaid and intensified many of these fractures, but it did not create them from nothing. Asia became one of the principal theaters in which the United States, the Soviet Union, and China competed indirectly for ideological and strategic influence. Korea, Vietnam, Afghanistan, Cambodia, Laos, Indonesia, and large parts of the Middle East became sites where local struggles fused with superpower rivalry.<Cite ids={[45]}/> Christopher Bayly and Tim Harper's <em>Forgotten Wars</em> recovers the linked Southeast Asian decolonizations of this period with particular care;<Cite ids={[57]}/> Prasenjit Duara's <em>Decolonization: Perspectives from Now and Then</em> situates the Asian cases within the broader pattern of postwar state formation under conditions of geopolitical pressure.<Cite ids={[58]}/>
            </p>
          </div>

          <SubsectionHeading eyebrow="MECHANISM THREE" title="The third mechanism: refugee production and immigration reform" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              The third mechanism was the synchronization of refugee production with immigration reform in North America. The United States Immigration and Nationality Act of 1965, often referred to as Hart-Celler, and Canada's introduction of a points-based immigration system through Order-in-Council PC 1967-1616 in August 1967, dismantled much of the explicit racial architecture that had previously restricted Asian migration. These reforms coincided historically with decades during which Asia generated some of the largest refugee flows in the world.
            </p>
            <p>
              The Vietnamese, Cambodian, Laotian, Hmong, Afghan, Iranian, Lebanese, Sri Lankan Tamil, Iraqi, Syrian, and Rohingya diasporas in North America took shape, in significant part, because legal pathways to entry expanded during the same years that wars, occupations, authoritarian regimes, and state collapse displaced millions of people across Asia.<Cite ids={[4, 56]}/> The third-country resettlement of approximately ninety thousand Bhutanese Lhotshampa after 2007, primarily to the United States, is a more recent expression of the same synchronization &#x2014; a refugee population produced by a state campaign of ethnic cleansing in the early 1990s, then received by North American states whose immigration architecture had, by the time of resettlement, been adapted to receive them.<Cite ids={[59]}/>
            </p>
            <p>
              Yen Le Espiritu's <em>Body Counts</em> names the resulting condition with particular precision in the Vietnamese case. The refugees produced by the American war were absorbed into an American national narrative that simultaneously memorialized the war as a tragedy and rendered the refugees themselves as evidence of American humanitarianism &#x2014; a structure that Espiritu calls <em>militarized refuge</em>. The framing applies, with adjustments, to other diasporic cases as well: the refugee is welcomed within a frame that obscures what produced the refugee.<Cite ids={[56]}/>
            </p>
          </div>

          <SubsectionHeading eyebrow="REBUILDING" title="Reconstruction" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              Yet the history that emerges from this circuit cannot be understood only through rupture. The same communities shaped by displacement, exclusion, and migration have also transformed the societies they entered. Asian communities across Canada and the United States built businesses, labor networks, cultural institutions, religious organizations, political movements, artistic traditions, research institutions, scholarly disciplines, and forms of community care that have become inseparable from North American life.<Cite ids={[54]}/> Asian Heritage Month exists, in part, because these histories were too important to remain peripheral to the national stories that produced them.
            </p>
            <p>
              The history of Asian North America is therefore not only a history of suffering, displacement, or war. It is also a history of reconstruction: of people rebuilding social worlds across languages, borders, and generations; of communities transforming exclusion into political organization; of migrants, refugees, workers, students, scholars, artists, and families reshaping the societies around them while carrying memories of other places.
            </p>
          </div>

          <SubsectionHeading eyebrow="CLOSING" title="What the holiday holds, and what it misses" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              The standard institutional form of the commemoration tends to celebrate the arrival without commemorating the departure. It tells a story of contribution, belonging, and resilience, but it elides the imperial and military circuits through which many of the underlying displacements occurred. The month is not dishonest. It is incomplete, in a manner that mirrors the incomplete public memory of decolonization and the Cold War more generally.
            </p>
            <p>
              A more rigorous version of the commemoration would hold two recognitions together rather than one. It would acknowledge that the cuisine, the languages, the literatures, the kinship networks, the religious traditions, and the families being celebrated are not separable from the displacements that brought many of them to the host country &#x2014; and that the displacements themselves were not random events but were substantially produced by policies and conflicts whose continuities extend into the present.
            </p>
            <p style={{ color: '#f1ead9' }}>
              To remember the violence that shaped postwar Asia is not to reduce Asian history to violence. It is to understand more fully the scale of what people survived, what they rebuilt, what they carried forward, and what they created afterward.
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PART IV                                                         */}
        {/* ============================================================ */}
        <section className="mt-20 sm:mt-24">
          <div className="mono text-[10px] tracking-[0.3em] mb-3" style={{ color: '#b8956a' }}>PART IV</div>
          <h2 className="serif font-medium mb-6" style={{ color: '#f1ead9', fontSize: 'clamp(26px, 4vw, 32px)', lineHeight: 1.1 }}>
            Methodology, Caveats, and Uncertainties
          </h2>

          <SubsectionHeading eyebrow="CITATION" title="Citation system" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              This project uses a numeric reference system in the Vancouver style. Every claim attributable to a specific source carries a superscript number in the text, and the full bibliographic entry appears in the numbered list at the end of the page. Clicking any superscript scrolls directly to the matching reference; the destination row briefly highlights, so that the eye can locate it. The numbering is consistent across event tooltips and analytical text &#x2014; reference 18, for example, is Talbot and Singh's <em>The Partition of India</em> wherever it appears.
            </p>
          </div>

          <SubsectionHeading eyebrow="METHODOLOGY" title="Classification and counting" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              The catalogue distinguishes two analytical categories. <em>Armed Conflict</em> includes interstate wars, civil wars, sustained insurgencies, and short but consequential conventional clashes; these appear in the timeline as solid bars. <em>Political Mass Violence</em> includes state repression, politicide, ethnic cleansing, genocide, policy-induced famine, and systematic detention; these appear as patterned bars marked with a PV badge. Where analytically warranted, sub-events such as the Yazidi genocide and the Mullivaikkal mass killing are treated alongside their parent conflicts rather than as separate entries. The geographic scope follows the conventional United Nations Asia scheme, including the South Caucasus and including the Soviet Union only where it appears as an external actor in conflicts whose opponent is an Asian state &#x2014; the Sino-Soviet Border Conflict and the Soviet-Afghan War. Casualty and displacement figures are mid-range estimates drawn from the cited sources. The cumulative displacement total double-counts individuals displaced more than once. This is a known feature of the methodology rather than an error.
            </p>
            <p>
              The two analytical categories draw on different evidentiary regimes, and the distinction matters more than a casual reader might assume. The Uppsala Conflict Data Program (UCDP) and the PRIO Battle Deaths Dataset code state-based armed conflict, non-state conflict, and one-sided violence above a twenty-five-deaths-per-year threshold. Both restrict the count to battle-related fatalities, and neither separately codes politicide, ethnic cleansing, deaths in detention, or non-fatal state repression.<Cite ids={[1, 2]}/> The Armed Conflict Location and Event Data Project (ACLED) records discrete political-violence events &#x2014; battles, explosions and remote violence, violence against civilians &#x2014; and demonstrations; ACLED achieved full global real-time coverage only in 2022, which means historical depth varies considerably across the catalogue.<Cite ids={[3]}/>
            </p>
            <p>
              For the broader categories that this project also includes &#x2014; politicide, mass detention, systematic state repression, policy-induced famine &#x2014; the analytical literature draws on Barbara Harff's Genocide/Politicide dataset,<Cite ids={[60]}/> the Political Terror Scale,<Cite ids={[61]}/> and the Political Instability Task Force <em>State Failure</em> dataset,<Cite ids={[62]}/> supplemented by individual UN Commission of Inquiry reports and by academic monographs cited per event.<Cite ids={[8, 41]}/> Lacina and Gleditsch's 2005 article in the <em>European Journal of Population</em> sets out the methodological distinctions between combatant deaths, battle deaths, and war deaths that this project follows.<Cite ids={[47]}/>
            </p>
          </div>

          <SubsectionHeading eyebrow="CAVEATS" title="Five categories of uncertainty" />
          <div className="space-y-4 sans text-[14px] sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: 'rgba(232,226,212,0.85)' }}>
            <p>
              The casualty figures presented throughout are mid-range estimates. The certainty conveyed by any single number frequently exceeds the certainty that the underlying historiography supports, and readers are asked to keep this in view.
            </p>
            <p>
              The first source of uncertainty is <em>definitional</em>. The line between an armed conflict and a campaign of political mass violence is analytically useful but empirically porous. The Indonesian Mass Killings of 1965 to 1966 are coded here as an armed conflict because they involved organized military mobilization, but they could equally be classified as politicide. Comparable ambiguities apply to the Khmer Rouge regime, the second JVP insurrection in Sri Lanka, the Anfal campaign in Iraqi Kurdistan, and the West Papua conflict. The category distinction is a heuristic. It is useful, but it is not a finding.
            </p>
            <p>
              The second is <em>numerical uncertainty within events</em>. The Great Leap Forward famine ranges from 30 to 45 million across reputable scholarly estimates, depending on demographic assumptions.<Cite ids={[10, 11, 13]}/> The Cultural Revolution ranges from 1.1 to 1.7 million on Andrew Walder's county-annal analysis.<Cite ids={[14]}/> Tiananmen ranges from several hundred (most scholarly estimates) to ten thousand (a declassified British diplomatic cable citing a State Council source). The Partition of India ranges from one to two million in Talbot and Singh's authoritative figures to higher numbers elsewhere.<Cite ids={[18]}/> The 1988 Iranian executions range from 2,800 (Amnesty International) to 30,000 (the Mojahedin-e Khalq's estimate).<Cite ids={[7, 40]}/> The Bangladesh Liberation War ranges from approximately 300,000 (Rahman and colleagues in <em>PLOS One</em>, 2025) to three million (the official Bangladeshi state figure).<Cite ids={[39, 44]}/> These ranges reflect genuine and often politically charged disputes about counting methods, source access, and the contested boundary between direct killing and indirect mortality.
            </p>
            <p>
              The third concerns <em>contested legal and political terminology</em>. The Xinjiang campaign has been designated genocide by the legislatures of the United States, the United Kingdom, Canada, and the Netherlands. The UN Office of the High Commissioner for Human Rights found acts that may constitute crimes against humanity, but did not apply the genocide label.<Cite ids={[8, 20]}/> The final phase of the Sri Lankan civil war has been characterized as genocide by the Permanent Peoples' Tribunal but not by the UN Panel of Experts.<Cite ids={[23]}/> The Anfal campaign was classified as genocide by the Dutch Hague court in 2005 and by the Iraqi Supreme Criminal Tribunal in 2010. The Rohingya case is the subject of an active International Court of Justice proceeding under the Genocide Convention.<Cite ids={[21]}/> These labels matter &#x2014; for international law, for memory politics, for diaspora mobilization &#x2014; and they are not uniformly applied across cases that involve comparable patterns of violence.
            </p>
            <p>
              The fourth is <em>source-quality variation</em>. Frank Dik&#xF6;tter's high-end figure of 45 million for the Great Leap Forward has been criticized by historians, including Felix Wemheuer, for the methodological choices involved in extrapolating from local archival samples; the broadly accepted range remains 30 to 45 million.<Cite ids={[10, 11]}/> The Mojahedin-e Khalq's figure of 30,000 for the 1988 Iranian executions exceeds Amnesty International's and Human Rights Watch's estimates by roughly an order of magnitude and reflects the organization's own positioning rather than independent verification. The Falun Gong death-in-custody figures compiled by Minghui are practitioner-compiled; they have been used by the China Tribunal as evidence, but they cannot be independently audited under current conditions in the People's Republic of China.<Cite ids={[35]}/>
            </p>
            <p>
              The fifth concerns <em>the ongoing nature of certain events</em>. The Xinjiang campaign, the North Korean <em>kwalliso</em> system, the Falun Gong persecution, the Myanmar military's repression, the West Papua conflict, and the Israeli operations in Gaza and Lebanon as of May 2026 are not closed historical events. Their casualty and displacement figures are running totals that may change substantially in the coming years, and their political characterization is, in many cases, the subject of ongoing international litigation and diplomatic dispute.<Cite ids={[27, 33, 42]}/>
            </p>
            <p style={{ color: '#f1ead9' }}>
              The compiled total of approximately seventy million dead across all events is anchored substantially by Chinese political campaigns and famines, which alone account for 35 to 55 million. The right inference from these numbers is structural rather than precise. The human cost of state and inter-state violence in Asia since 1945 is of an order of magnitude that warrants the same kind of sustained public recognition that the European twentieth century has received &#x2014; even where the precise figure for any particular event remains contested.
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* REFERENCES                                                      */}
        {/* ============================================================ */}
        <section className="mt-20 sm:mt-24">
          <div className="mono text-[10px] tracking-[0.3em] mb-3" style={{ color: '#b8956a' }}>REFERENCES</div>
          <h2 className="serif font-medium mb-6" style={{ color: '#f1ead9', fontSize: 'clamp(26px, 4vw, 32px)', lineHeight: 1.1 }}>
            Citation Reference List
          </h2>
          {(() => {
            const REF_SECTIONS = [
              { startAt: 1,  label: "Datasets and institutional sources" },
              { startAt: 10, label: "Books and articles cited in the event catalogue" },
              { startAt: 20, label: "Event-specific reports and investigations" },
              { startAt: 45, label: "Scholarship cited in the analytical sections" },
              { startAt: 60, label: "Politicide, repression, and state-failure datasets" },
              { startAt: 63, label: "Heritage Month institutional history" },
            ];
            return (
              <ol className="sans text-[12px] sm:text-[13px] leading-relaxed" style={{ color: 'rgba(232,226,212,0.75)' }}>
                {CITATIONS.map(c => {
                  const section = REF_SECTIONS.find(s => s.startAt === c.n);
                  return (
                    <React.Fragment key={c.n}>
                      {section && (
                        <li className="mono text-[10px] tracking-[0.25em] mt-6 mb-2 px-2"
                          style={{ color: '#b8956a', listStyle: 'none' }}>
                          {section.label.toUpperCase()}
                        </li>
                      )}
                      <li id={'ref-' + c.n} className="flex gap-3 px-2 py-1"
                        style={{ scrollMarginTop: '2rem', borderBottom: '1px solid rgba(232,226,212,0.04)' }}>
                        <span className="mono shrink-0" style={{ color: '#b8956a', minWidth: '28px' }}>{c.n}.</span>
                        <span className="flex-1 min-w-0">
                          {c.text}{' '}
                          <a href={c.url} target="_blank" rel="noopener noreferrer"
                            className="underline break-all"
                            style={{ color: 'rgba(184,149,106,0.85)' }}>
                            {c.url.replace(/^https?:\/\//, '')}
                          </a>
                        </span>
                      </li>
                    </React.Fragment>
                  );
                })}
              </ol>
            );
          })()}
        </section>

      </div>
    </div>
  );
}
