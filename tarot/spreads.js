module.exports = {
  kelticCross: {
    name: 'Кельтский крест',
    cards: 10,
    description: [
      '1 - текущее положение дел,особенности ситуации',
      '2 - дополнительные факторы что мешает/помогает',
      '3 - что человек думает о данной ситуации ( область сознания)',
      '4 - что человек чувствует,что подсказывает интуиция (область подсознания)', 
      '5 - что предшествовало ситуации (ближайшие прошлое)', 
      '6 - что последует за ситуацией ( ближайшие будущее)',
      '7 - сама личность клиента в ситуации', 
      '8 - внешние факторы, которые могут повлиять (форс-мажоры, окружение)', 
      '9 - страхи и надежды человека', 
      '10 - итоговый исход ситуации, чем всё закончится',
    ]
  },
  bridge: {
    name: 'Мост',
    cards: 7,
    description: [
      '1 - ситуация на сегодня',
      '2 - что мешает',
      '3 - что может помочь',
      '4 - к чему может привести', 
      '5 - что делать для достижения цели', 
      '6 - чего не следует делать', 
      '7 - чем всё закончится',
    ]
  },
  tree: {
    name: 'Ёлка',
    cards: 8,
    description: [
      '1 - корни - что тянется из прошлого?',
      '2 - надежды/планы',
      '3 - что пока не проявлено (надо подождать,потенциал)? ',
      '4 - что мешает (ограничения, помехи)? ', 
      '5 - что поможет?', 
      '6 - что должно уйти (чему не препятствовать)?',
      '7 - что должно прийти? ', 
      '8 - каков позитивный итог периода',
    ]
  }, 
  track: {
    name: 'След',
    cards: 6,
    description: [
      '1 - цели месяца', 
      '2 - шансы месяца', 
      '3 - первая половина месяца', 
      '4 - вторая половина месяца',
      '5 - общий итог месяца', 
      '6 - с чем выходим в новый месяц',
    ]
  },
  me and him: {
    name: 'Я и Он',
    cards: 10,
    description: [
      '1 - что он думает о вас?', 
      '2 - что он чувствует к вам?', 
      '3 - что он хочет от отношений с вами?', 
      '4 - что вас связывает? ', 
      '5 - есть ли какие-либо проблемы с его стороны?', 
      '6 - что вы думаете о нем?', 
      '7 - что вы чувствуете к нему?', 
      '8 - есть ли какие-либо проблемы с вашей стороны?', 
      '9 - как решить или смягчить наши проблемы?', 
      '10 - совет, как укрепить отношения', 
    ]
  }, 
  star david: {
    name: 'Звезда Давида', 
    cards: 7,
    description: [
      '1 - описывает причины возникновения ситуации,её корни, то, с чего всё началось', 
      '2 - показывает ситуацию в настоящем времени', 
      '3 - последствия, которые проявятся в будущем', 
      '4 - позитивные стороны создавшегося положения для клиента', 
      '5 - негативные стороны', 
      '6 - подсказка, что нужно делать человеку, где искать выход', 
      '7 - скрытый фактор - обстоятельства, о которых спрашивающий пока ещё не знает', 
    ]
  }, 

const spreads = {
  tenCardLayout: {
    name: "Расклад Кельтский крест на 10 карт",
    positions: [
      { id: "card1", x: 20,  y: 40 },
      { id: "card2", x: 92,  y: 40 },
      { id: "card3", x: 164, y: 40 },
      { id: "card4", x: 236, y: 40 },
      { id: "card5", x: 308, y: 40 },
      { id: "card6", x: 20,  y: 160 },
      { id: "card7", x: 92,  y: 160 },
      { id: "card8", x: 164, y: 160 },
      { id: "card9", x: 236, y: 160 },
      { id: "card10", x: 308, y: 160 },
    ]
  }
};

const spreads = {
  tenCardLayout: {
    name: "Расклад Мост на 7 карт",
    positions: [
      { id: "card1", x: 20,  y: 40 },
      { id: "card2", x: 92,  y: 40 },
      { id: "card3", x: 164, y: 40 },
      { id: "card4", x: 236, y: 40 },
      { id: "card5", x: 308, y: 40 },
      { id: "card6", x: 20,  y: 160 },
      { id: "card7", x: 92,  y: 160 },
    ]
  }
};

const spreads = {
  tenCardLayout: {
    name: "Расклад Ëлка на 8 карт",
    positions: [
      { id: "card1", x: 20,  y: 40 },
      { id: "card2", x: 92,  y: 40 },
      { id: "card3", x: 164, y: 40 },
      { id: "card4", x: 236, y: 40 },
      { id: "card5", x: 308, y: 40 },
      { id: "card6", x: 20,  y: 160 },
      { id: "card7", x: 92,  y: 160 },
      { id: "card8", x: 164, y: 160 },
    ]
  }
};

const spreads = {
  tenCardLayout: {
    name: "Расклад След на 6 карт",
    positions: [
      { id: "card1", x: 20,  y: 40 },
      { id: "card2", x: 92,  y: 40 },
      { id: "card3", x: 164, y: 40 },
      { id: "card4", x: 236, y: 40 },
      { id: "card5", x: 308, y: 40 },
      { id: "card6", x: 20,  y: 160 },
    ]
  }
};

const spreads = {
  tenCardLayout: {
    name: "Расклад Я и Он на 10 карт", 
    positions: [
      { id: "card1", x: 20,  y: 40 },
      { id: "card2", x: 92,  y: 40 },
      { id: "card3", x: 164, y: 40 },
      { id: "card4", x: 236, y: 40 },
      { id: "card5", x: 308, y: 40 },
      { id: "card6", x: 20,  y: 160 },
      { id: "card7", x: 92,  y: 160 },
      { id: "card8", x: 164, y: 160 },
      { id: "card9", x: 236, y: 160 },
      { id: "card10", x: 308, y: 160 },
    ]
  }
};

const spreads = {
  tenCardLayout: {
    name: "Расклад Звезда Давида на 7 карт", 
    positions: [
      { id: "card1", x: 20,  y: 40 },
      { id: "card2", x: 92,  y: 40 },
      { id: "card3", x: 164, y: 40 },
      { id: "card4", x: 236, y: 40 },
      { id: "card5", x: 308, y: 40 },
      { id: "card6", x: 20,  y: 160 },
      { id: "card7", x: 92,  y: 160 },
    ]
  }
};

function renderSpreadLayout(spread) {
  const container = document.getElementById("cards");
  container.innerHTML = ""; // Очищаем предыдущие карты
  container.style.position = "relative"; // Для абсолютного позиционирования

  spread.positions.forEach(pos => {
    const card = document.createElement("img");
    card.src = `/cards/back.png`; // или динамически подставляй карту
    card.alt = pos.id;
    card.classList.add("card");
    card.style.position = "absolute";
    card.style.left = `${pos.x}px`;
    card.style.top = `${pos.y}px`;
    card.style.width = "60px";  // фиксированный размер
    card.style.height = "100px";
    container.appendChild(card);
  });
}
