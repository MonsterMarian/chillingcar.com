// Literature questions data for maturita
const literatureData = {
  gatsby: {
    title: "Velký Gatsby",
    author: "F. Scott Fitzgerald",
    period: "Meziválečné období (1920-1930)",
    genre: "Román",
    questions: {
      genre: [
        { question: "Do jakého literárního žánru patří román Velký Gatsby?", answers: ["Román", "Povídka", "Drama", "Básnická sbírka"], correct: [0] },
        { question: "Jaký je hlavní literární žánr díla Velký Gatsby?", answers: ["Detektivní román", "Psychologický román", "Historický román", "Sociální román"], correct: [1] }
      ],
      author: [
        { question: "Kdo je autorem románu Velký Gatsby?", answers: ["Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck", "William Faulkner"], correct: [1] }
      ],
      authorDetails: [
        { question: "Ve kterém roce se narodil F. Scott Fitzgerald?", answers: ["1890", "1896", "1900", "1885"], correct: [1] }
      ],
      authorPeriod: [
        { question: "Která kulturní éra je spojena s tvorbou F. Scotta Fitzgeralda?", answers: ["Éra prosperity", "Éra jazzu", "Beatnická éra", "Období rozcvičky"], correct: [1] }
      ],
      plot: [
        { question: "Jaký je hlavní motiv Gatsbyho snažení?", answers: ["Získat zpět lásku Daisy", "Stát se prezidentem", "Získat co nejvíce peněz pro chudobu"], correct: [0] }
      ],
      characters: [
        { question: "Jak se vyvíjí postava Nicka Carrawaye?", answers: ["Ztrácí iluze o společnosti", "Stává se zkorumpovaným", "Spáchá sebevraždu"], correct: [0] }
      ],
      style: [
        { question: "Jakým způsobem je kniha vyprávěna?", answers: ["Vševědoucí vypravěč", "Ich-forma skrze Nicka Carrawaye", "Střídání perspektiv"], correct: [1] }
      ]
    }
  },
  
  romeo: {
    title: "Romeo a Julie",
    author: "William Shakespeare",
    period: "Renesance (16. století)",
    genre: "Tragédie",
    questions: {
      genre: [{ question: "Do jakého dramatického žánru patří dílo Romeo a Julie?", answers: ["Komedie", "Tragédie", "Historická hra", "Pastorační drama"], correct: [1] }],
      author: [{ question: "Kdo je autorem hry Romeo a Julie?", answers: ["Christopher Marlowe", "Ben Jonson", "William Shakespeare", "Thomas Kyd"], correct: [2] }],
      authorDetails: [{ question: "Ve kterém roce se narodil William Shakespeare?", answers: ["1558", "1564", "1570", "1550"], correct: [1] }],
      authorPeriod: [{ question: "Ve kterém historickém období žil William Shakespeare?", answers: ["Středověk", "Renesance", "Baroko", "Osvícenské období"], correct: [1] }],
      plot: [{ question: "Kde se příběh převážně odehrává?", answers: ["V Londýně", "V Římě", "Ve Veroně", "V Benátkách"], correct: [2] }],
      characters: [{ question: "Z jakých rodů pochází hlavní hrdinové?", answers: ["Montekové a Kapuleti", "Lancasterové a Yorkové", "Tudorové a Stuartovci"], correct: [0] }],
      style: [{ question: "Jakým veršem je hra převážně napsána?", answers: ["Volným veršem", "Blankversem (nerýmovaný jambický pentametr)", "Hexametrem"], correct: [1] }]
    }
  },
  
  hamlet: {
    title: "Hamlet",
    author: "William Shakespeare",
    period: "Renesance (16. století)",
    genre: "Tragédie",
    questions: {
      genre: [{ question: "Do jakého dramatického žánru patří dílo Hamlet?", answers: ["Komedie", "Tragédie", "Historická hra"], correct: [1] }],
      author: [{ question: "Kdo je autorem hry Hamlet?", answers: ["Ben Jonson", "William Shakespeare", "Thomas Kyd"], correct: [1] }],
      authorDetails: [{ question: "Jak se jmenuje univerzita, na kterou chodil princ Hamlet?", answers: ["Oxford", "Cambridge", "Wittenberg", "Princeton"], correct: [2] }],
      authorPeriod: [{ question: "Ve kterém historickém období byla napsána hra Hamlet?", answers: ["Středověk", "Renesance", "Baroko"], correct: [1] }],
      plot: [{ question: "Jak končí hra Hamlet?", answers: ["Hamlet usedá na trůn", "Hamlet žije v exilu", "Téměř všechny hlavní postavy umírají, včetně Hamleta"], correct: [2] }],
      characters: [{ question: "Jaká je hlavní příčina Hamletova váhání?", answers: ["Strach z války", "Rozpor mezi povinností pomsty a morálními zásadami", "Nedostatek zbraní"], correct: [1] }],
      style: [{ question: "Co je charakteristické pro jazyk Hamleta?", answers: ["Používá pouze prózu", "Bohatě využívá filozofické monology a slovní hříčky", "Využívá jen nářečí"], correct: [1] }]
    }
  },

  cernousci: {
    title: "Deset malých černoušků",
    author: "Agatha Christie",
    period: "Světová literatura 20. století",
    genre: "Detektivní román",
    questions: {
      genre: [{ question: "Jaký je žánr Deseti malých černoušků?", answers: ["Detektivní román", "Povídka", "Drama", "Epos"], correct: [0] }],
      author: [{ question: "Kdo je autorem tohoto díla?", answers: ["Dick Francis", "Agatha Christie", "Ed McBain"], correct: [1] }],
      authorDetails: [{ question: "Jak se Agathě Christie přezdívalo?", answers: ["Královna detektivek", "První dáma literatury", "Matka hororu"], correct: [0] }],
      authorPeriod: [{ question: "Ve které zemi Agatha Christie žila?", answers: ["USA", "Francie", "Velká Británie", "Austrálie"], correct: [2] }],
      plot: [
        { question: "Jak končí příběh Deseti malých černoušků?", answers: ["Přežije jen Vera", "Všichni na ostrově zemřou, závěr je tragický a uzavřený doznáním v láhvi", "Přijede detektiv a vraha zatkne"], correct: [1] },
        { question: "Co se děje s porcelánovými figurkami?", answers: ["Žijí vlastním životem", "Mizí ze stolu souběžně s každým úmrtím", "Jsou rozbity hned první den"], correct: [1] }
      ],
      characters: [
        { question: "Jaký je psychologický vývoj Very Claythornové?", answers: ["Zůstává racionální", "Prochází rozkladem osobnosti, podlehne paranoie a spáchá sebevraždu", "Zjistí pravdu a uteče"], correct: [1] },
        { question: "Jakou roli hraje soudce Lawrence Wargrave?", answers: ["Je první obětí", "Většinu knihy udržuje masku racionálního vůdce, ale ve skutečnosti je vrah", "Je to policista v utajení"], correct: [1] }
      ],
      style: [
        { question: "Jakou kompozici má závěrečné vysvětlení v láhvi?", answers: ["Chronologickou", "Retrospektivní, protože zpětně vysvětluje události", "Paralelní"], correct: [1] },
        { question: "Jakou vypravěčskou formou je kniha psána?", answers: ["Er-forma", "Ich-forma"], correct: [0] }
      ]
    }
  },

  orwell1984: {
    title: "1984",
    author: "George Orwell",
    period: "Světová literatura po 2. sv. válce",
    genre: "Antiutopický román",
    questions: {
      genre: [{ question: "Jaký žánr je 1984?", answers: ["Antiutopický román", "Utopie", "Historický román"], correct: [0] }],
      author: [{ question: "Který autor napsal 1984?", answers: ["H. G. Wells", "George Orwell", "Franz Kafka"], correct: [1] }],
      authorDetails: [{ question: "V jakém roce byla kniha vydána?", answers: ["1984", "1949", "1950"], correct: [1] }],
      authorPeriod: [{ question: "Jak se jmenuje všudypřítomná postava v knize?", answers: ["Velký bratr", "Velký vůdce", "Velký otec"], correct: [0] }],
      plot: [{ question: "Jak končí román 1984?", answers: ["Winston je zastřelen při útěku", "Winston je zlomen, zradí Julii a miluje Velkého bratra", "Winston a Julie svrhnou Stranu"], correct: [1] }],
      characters: [{ question: "Jaký je postupný osud Winstona Smithe?", answers: ["Z rebela se stává poslušným členem Strany skrz mučení", "Vždycky byl zarytý fanda Strany", "Stává se vůdcem Odboje"], correct: [0] }],
      style: [{ question: "Jaké specifické jazykové prostředky se zde objevují?", answers: ["Pouze archaismy", "Novotvary jazyka Newspeak (např. doublethink)", "Hantec"], correct: [1] }]
    }
  },

  farma: {
    title: "Farma zvířat",
    author: "George Orwell",
    period: "Světová literatura po 2. sv. válce",
    genre: "Alegorická bajka",
    questions: {
      genre: [{ question: "Co je to Farma zvířat?", answers: ["Alegorická bajka", "Cestopis", "Detektivka"], correct: [0] }],
      author: [{ question: "Kdo je autorem Farmy zvířat?", answers: ["Aldous Huxley", "George Orwell", "Ray Bradbury"], correct: [1] }],
      authorDetails: [{ question: "Jaké bylo skutečné jméno George Orwella?", answers: ["Eric Arthur Blair", "Samuel Clemens", "Charles Dodgson"], correct: [0] }],
      authorPeriod: [{ question: "Kritikou čeho je toto dílo?", answers: ["Kapitalismu", "Totalitarismu (specificky stalinismu)", "Náboženství"], correct: [1] }],
      plot: [{ question: "Co je hlavním tématem Farmy zvířat?", answers: ["Život na anglickém venkově", "Ztráta původních ideálů revoluce a nastolení diktatury", "Boj proti environmentálnímu znečištění"], correct: [1] }],
      characters: [{ question: "Koho symbolizují prasata Napoleon a Kulišek?", answers: ["Demokratické politiky", "Stalina a Trockého", "Obyčejné dělníky"], correct: [1] }],
      style: [{ question: "Jakou formou je kniha zpracována?", answers: ["Alegorie a personifikace zvířat", "Faktografický dokument", "Historický epos"], correct: [0] }]
    }
  },
  
  fahrenheit: {
    title: "451 stupňů Fahrenheita",
    author: "Ray Bradbury",
    period: "Světová literatura po 2. sv. válce",
    genre: "Antiutopický román",
    questions: {
      genre: [{ question: "O čem je tento román?", answers: ["Pálení knih", "Vaření", "Hasičích v lese"], correct: [0] }],
      author: [{ question: "Kdo napsal 451 stupňů Fahrenheita?", answers: ["Isaac Asimov", "Ray Bradbury", "Arthur C. Clarke"], correct: [1] }],
      authorDetails: [{ question: "Jaká je teplota vznícení papíru ve stupních Celsia?", answers: ["451", "233", "100"], correct: [1] }],
      authorPeriod: [{ question: "Ke kterému žánru Bradburyho dílo řadíme?", answers: ["Realismus", "Sci-fi", "Dadaismus"], correct: [1] }],
      plot: [{ question: "Jaký je hlavní konflikt knihy?", answers: ["Boj za zachování lidského vědění, paměti a literatury", "Konflikt mezi státy", "Invaze mimozemšťanů"], correct: [0] }],
      characters: [{ question: "Kdo je Guy Montag?", answers: ["Hasič, který knihy chrání od začátku", "Hasič, který začne o své práci pochybovat a knihy zachraňovat", "Kapitán hasičů"], correct: [1] }],
      style: [{ question: "Jaká z domněnek ohledně názvu knihy je pravdivá?", answers: ["Je to symbolická teplota, při níž začínají hořet stránky knih", "Je to jméno hlavní postavy", "Je to počet dní do války"], correct: [0] }]
    }
  }
};

// Literární teorie questions data
const theoryData = {
  figury: [
    { question: "Co je to epizeuxis?", answers: ["Opakování slov za sebou v jednom verši", "Básnický přívlastek", "Změněný slovosled"], correct: [0] },
    { question: "Co je to anafora?", answers: ["Opakování slov na začátku verše", "Opakování hlásek na začátku sousedních slov", "Zveličená skutečnost"], correct: [0] },
    { question: "Co znamená inverze?", answers: ["Vypuštění slov", "Změněný slovosled", "Protikladný význam"], correct: [1] },
    { question: "Jak se nazývá opakování slov na konci verše?", answers: ["Epifora", "Anafora", "Epanastrofa"], correct: [0] }
  ],
  tropy: [
    { question: "Co je to personifikace?", answers: ["Zosobnění - přenesení lidských vlastností na neživé věci", "Přenesení významu na základě vnitřní souvislosti", "Nadsázka"], correct: [0] },
    { question: "Co je to metafora?", answers: ["Záměrné užití slov v opačném smyslu", "Přenesení významu na základě vnější podobnosti", "Básnický přívlastek"], correct: [1] },
    { question: "Co je to oxymorón?", answers: ["Zvláštní uspořádání hlásek", "Protimluv, nesmyslné spojení slov (např. mrtvé milenky cit)", "Zjemnění skutečnosti"], correct: [1] },
    { question: "Jak se nazývá nadsázka (zveličení skutečnosti)?", answers: ["Hyperbola", "Alegorie", "Eufemismus"], correct: [0] }
  ],
  lexikologie: [
    { question: "Co jsou to homonyma?", answers: ["Slova opačného významu", "Slova, která se stejně vyslovují i píšou, ale mají jiný význam (např. koruna)", "Slova různého znění, ale podobného významu"], correct: [1] },
    { question: "Které slovo je synonymem ke slovu 'nerost'?", answers: ["Zvíře", "Rostlina", "Minerál"], correct: [2] },
    { question: "Co jsou to antonyma?", answers: ["Slova protikladného významu", "Zastaralá slova", "Slova se stejným významem"], correct: [0] },
    { question: "Pojmy jako slovenský, český, německý patří pod jaké nadřazené slovo (hyperonymum)?", answers: ["Žánry", "Jazyky", "Města"], correct: [1] }
  ],
  slovniDruhy: [
    { question: "Jaký je rozdíl mezi ohebnými a neohebnými slovními druhy?", answers: ["Ohebná slova mění tvar (skloňují se/časují), neohebná ne", "Neohebná slova mění tvar", "Není v nich rozdíl"], correct: [0] },
    { question: "Do jakého slovního druhu patří slovo 'včera'?", answers: ["Předložka", "Příslovce", "Částice", "Spojka"], correct: [1] },
    { question: "Který z těchto slovních druhů je neohebný?", answers: ["Podstatné jméno", "Číslovka", "Spojka", "Zájmeno"], correct: [2] },
    { question: "Do které skupiny podstatných jmen patří 'ptactvo' nebo 'listí'?", answers: ["Pomnožná", "Hromadná", "Látková"], correct: [1] },
    { question: "Jaké slovo je vždy částice?", answers: ["Kolem", "Kéž", "Bratrův", "Špatně"], correct: [1] }
  ],
  slovniZasoba: [
    { question: "Co jsou archaismy?", answers: ["Zastaralé výrazy vytlačené novějším slovem (věc stále existuje)", "Zcela zaniklé skutečnosti", "Nová slova pro moderní technologie"], correct: [0] },
    { question: "Co jsou historismy?", answers: ["Zastaralá slova", "Výrazy pro zaniklé věci (např. dráb, žezlo)", "Básnické výrazy"], correct: [1] },
    { question: "Co je to argot?", answers: ["Mluva typická pro daný region (nářečí)", "Mluva společenské spodiny a zlodějů pro utajení významu", "Profesní mluva lékařů"], correct: [1] },
    { question: "Co musí obsahovat 'přísloví' na rozdíl od rčení?", answers: ["Počasí", "Rým", "Mravní ponaučení"], correct: [2] }
  ]
};

// Function to get questions for literature mode
function getLiteratureQuestions(selectedWorksArray, categories) {
  const questions = [];
  
  if (selectedWorksArray.length === 0) return questions;

  selectedWorksArray.forEach(workKey => {
    const workData = literatureData[workKey];
    if (workData) {
      categories.forEach(category => {
        if (workData.questions[category]) {
          workData.questions[category].forEach(q => {
            questions.push({
              ...q,
              work: workKey,
              category: category,
              workTitle: workData.title,
              author: workData.author,
              period: workData.period,
              genre: workData.genre
            });
          });
        }
      });
    }
  });
  
  return questions;
}

// Function to get questions for theory mode
function getTheoryQuestions(theoryCategories) {
  const questions = [];

  theoryCategories.forEach(catKey => {
    if (theoryData[catKey]) {
      theoryData[catKey].forEach(q => {
        questions.push({
          ...q,
          work: "theory",
          category: catKey,
          workTitle: "Literární Teorie"
        });
      });
    }
  });

  return questions;
}