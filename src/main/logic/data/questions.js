const questions = [
	{
		question: {
			en:
				'What is the name of a ship that sank in 1912, in Atlantic ocean, after collision with iceberg, and has movie adaptation made in 1997?',
			lv:
				'Kā sauc kuģi, kas nogrima 1912 gadā, Atlantijas okeāna ziemeļos, pēc sadursmes ar aizbergu, un pēc kura 1997 gadā tika uzņemta filma?',
			ru:
				'Как называется корабль, который затонул в 1912 году в Атлантическом океане после столкновения с айсбергом, и про который в 1997 сняли фильм?',
		},
		variants: {
			en: ['HSM Victory', 'RMS Titanic', 'Santa Maria'],
			lv: ['HSM Victory', 'RMS Titanic', 'Santa Maria'],
			ru: ['HSM Victory', 'RMS Titanic', 'Santa Maria'],
		},
		answer: 1,
	},
	{
		question: {
			en:
				'What is the name of a sea that is enclosed by land - Europe from north, Africa from south and Asia from east, but is connected to Atlantic ocean via Strait of Gibraltar?',
			lv:
				'Kā sauc jūru, kas apskalo Āfrikas kontinentu no ziemeļiem, Eiropu no dienvidiem, Āziju no rietumiem bet ar Atlantijas okeānu to savieno Gibraltāra šaurums?',
			ru:
				'Как называется море, окруженное сушей - Европа с севера, Африка с юга и Азия с востока, но соединенное с Атлантическим океаном через Гибралтарский пролив?',
		},
		variants: {
			en: ['Black Sea', 'North Sea', 'Mediterranean Sea'],
			lv: ['Melnā jūra', 'Ziemeļjūra', 'Vidusjūra'],
			ru: ['Черное море', 'Северное море', 'Средиземное море'],
		},
		answer: 2,
	},
	{
		question: {
			en:
				'What is the name of actor who played Captain Jack Sparrow in Pirates of the Caribbean film series?',
			lv:
				'Kā sauc aktieri kurš attēloja kapteini Džeku zvirbuli filmās par karību jūru pirātiem?',
			ru:
				'Как зовут актера, сыгравшего капитана Джека Воробья в фильме «Пираты Карибского моря»?',
		},
		variants: {
			en: ['Sylvester Stallone', 'Johnny Depp', 'Antonio Banderas'],
			lv: ['Silvestrs Stalone', 'Džonijs Depps', 'Antonio Banderas'],
			ru: ['Сильвестр Сталлоне', 'Джонни Депп', 'Антонио Бандерас'],
		},
		answer: 1,
	},
	{
		question: {
			en:
				'How were named Norse people, who also raided Baltic sea and because of great ship crafting skills, were even able to cross Atlantic ocean and "discover" America long before Christopher Columbus did?',
			lv:
				'Kā dēvēja ziemeļu tautu pirātus kas darbojās arī baltijas jūrā un pateicoties mākai būvēt labus kuģus devās iekarojumos pat pāri Atlantijas okeānam un atklāja Ameriku ilgi pirms Kristofera Kolumba?',
			ru:
				'Как были названы норвежцы, которые также совершали набеги на Балтийское море и, благодаря отличным навыкам кораблестроения, смогли даже пересечь Атлантический океан и «открыть» Америку задолго до того, как это сделал Христофор Колумб?',
		},
		variants: {
			en: ['Vikings', 'Celtics', 'Slavic mafia'],
			lv: ['Vikingi', 'Ķelti', 'Slāvu mafija'],
			ru: ['Викинги', 'Кельты', 'Славянская мафия'],
		},
		answer: 0,
	},
	{
		question: {
			en:
				'What was the name of ship on which Christopher Columbus left Spain and run aground on "new world"?',
			lv:
				'Kā sauca kuģi ar kuru Kristofers Kolumbs 1492 gadā pameta Spānijas krastus un piestāja "Jaunajā pasaulē"?',
			ru:
				'Как назывался корабль, на котором Христофор Колумб покинул Испанию и сел на мель в «новом мире»?',
		},
		variants: {
			en: ['HSM Victory', 'RMS Titanic', 'Santa Maria'],
			lv: ['HSM Victory', 'RMS Titanic', 'Santa Maria'],
			ru: ['HSM Victory', 'RMS Titanic', 'Santa Maria'],
		},
		answer: 2,
	},
	{
		question: {
			en: 'What was most common sign of pirate ships?',
			lv: 'Kāda bija pirātu kuģa vispopulārākā pazīme?',
			ru: 'Что было самым распространенным признаком пиратских кораблей?',
		},
		variants: {
			en: [
				'Parrots',
				'Jolly Roger flag',
				'Pirate ships were enveloped in mist',
			],
			lv: ['Papagaiļi', 'Jolly Roger karogs', 'Pirātu kuģis bija tīts miglā'],
			ru: [
				'Попугаи',
				'Флаг Веселого Роджера',
				'Пиратские корабли были окутаны туманом',
			],
		},
		answer: 1,
	},
	{
		question: {
			en: 'How many oceans are on Earth?',
			lv: 'Cik pavisam okeānu ir uz Zemes?',
			ru: 'Сколько океанов на Земле?',
		},
		variants: {
			en: ['Two', 'Four', 'Six'],
			lv: ['Divi', 'Četri', 'Seši'],
			ru: ['Два', 'Четыре', 'Шесть'],
		},
		answer: 1,
	},
	{
		question: {
			en: 'Which one of these does not exist?',
			lv: 'Kurš no šiem nav īsts okeāns?',
			ru: 'Какой из них не существует?',
		},
		variants: {
			en: ['Arctic ocean', 'Australian ocean', 'Pacific ocean'],
			lv: ['Ziemeļu ledus okeāns', 'Austrālijas okeāns', 'Klusais okeāns'],
			ru: ['Северный Ледовитый океан', 'Австралийский океан', 'Тихий океан'],
		},
		answer: 1,
	},
	{
		question: {
			en: 'What is the name of deepest place on Earth?',
			lv: 'Kā sauc dziļāko vietu uz zemes?',
			ru: 'Как называется самое глубокое место на Земле?',
		},
		variants: {
			en: ['Marias Pit', 'Margaritas Crater', 'Marianas Trench'],
			lv: ['Marijas bedre', 'Margaritas krāteris', 'Marianas dziļvaga'],
			ru: ['Яма Марии', 'Кратер Маргариты', 'Марианская впадина'],
		},
		answer: 2,
	},
	{
		question: {
			en:
				'What is name of sea (lake), that is famous with high salt levels in water?',
			lv: 'Kā sauc jūru (ezeru), kas pazīstams ar augsto sāls saturu ūdenī?',
			ru:
				'Как называется море (озеро), которое славится высоким содержанием соли в воде?',
		},
		variants: {
			en: ['Barents Sea', 'Red Sea', 'Dead Sea'],
			lv: ['Barenca jūra', 'Sarkanā jūra', 'Nāves jūra'],
			ru: ['Баренцево море', 'Красное море', 'Мертвое море'],
		},
		answer: 2,
	},
];

export default questions;
