/* Умный фильтр каталога */

/* Группы фильтров: название, список вариантов и функция,
   которая по товару определяет его вариант в этой группе */
var groups = [
	{
		id: 'section',
		title: 'Раздел',
		options: ['Книги и аудио', 'Курсы и шаблоны', 'Игры и музыка'],
		get: function (p) { return p.section; }
	},
	{
		id: 'format',
		title: 'Формат',
		options: ['PDF', 'MP3', 'Видео', 'Windows', 'PPTX'],
		get: function (p) { return p.format; }
	},
	{
		id: 'price',
		title: 'Цена',
		options: ['до 300 ₽', '300–500 ₽', 'более 500 ₽'],
		get: function (p) {
			if (p.price < 300) { return 'до 300 ₽'; }
			if (p.price <= 500) { return '300–500 ₽'; }
			return 'более 500 ₽';
		}
	},
	{
		id: 'stock',
		title: 'Наличие',
		options: ['В наличии', 'Временно нет'],
		get: function (p) { return p.inStock ? 'В наличии' : 'Временно нет'; }
	}
];

var searchInput = document.getElementById('search');
var filtersBox = document.getElementById('filters');
var productsBox = document.getElementById('products');
var foundText = document.getElementById('found');
var resetButton = document.getElementById('reset');
var emptyText = document.getElementById('empty');

/* Создаём флажки для всех групп (один раз при загрузке страницы) */
function buildFilters() {
	for (var i = 0; i < groups.length; i++) {
		var g = groups[i];
		var column = document.createElement('div');
		column.className = 'filter-group';

		var title = document.createElement('h3');
		title.textContent = g.title;
		column.appendChild(title);

		g.selected = [];
		g.items = [];
		for (var j = 0; j < g.options.length; j++) {
			var label = document.createElement('label');
			var input = document.createElement('input');
			var name = document.createElement('span');
			var count = document.createElement('span');

			input.type = 'checkbox';
			name.textContent = g.options[j];
			count.className = 'count';

			label.appendChild(input);
			label.appendChild(name);
			label.appendChild(count);
			column.appendChild(label);

			input.addEventListener('change', update);
			g.items.push({ input: input, label: label, count: count });
		}
		filtersBox.appendChild(column);
	}
}

/* Подходит ли товар под выбранные фильтры.
   Группа skipId пропускается: так считаются числа у её вариантов. */
function matches(product, skipId) {
	var text = searchInput.value.toLowerCase().trim();
	if (product.title.toLowerCase().indexOf(text) === -1) {
		return false;
	}
	for (var i = 0; i < groups.length; i++) {
		var g = groups[i];
		if (g.id === skipId || g.selected.length === 0) {
			continue;
		}
		if (g.selected.indexOf(g.get(product)) === -1) {
			return false;
		}
	}
	return true;
}

function formatPrice(n) {
	return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') + '\u00A0₽';
}

/* Создаём на странице карточки только для подходящих товаров */
function showProducts(list) {
	var html = '';
	for (var i = 0; i < list.length; i++) {
		var p = list[i];
		html += '<div class="product">' +
			'<img src="images/' + p.image + '" alt="' + p.title + '" width="240" height="160" loading="lazy">' +
			'<h3>' + p.title + '</h3>' +
			'<p>' + p.text + '</p>' +
			'<ul><li>' + p.info[0] + '</li><li>' + p.info[1] + '</li></ul>' +
			'<p class="price">' + formatPrice(p.price) + '</p>' +
			(p.inStock ? '' : '<p class="stock">Временно нет в наличии</p>') +
			'</div>';
	}
	productsBox.innerHTML = html;

	if (list.length === 0) {
		emptyText.classList.remove('hide');
	} else {
		emptyText.classList.add('hide');
	}
}

/* Главная функция: вызывается при любом изменении фильтров или поиска */
function update() {
	var i, j, k, g, item, n, off;

	/* 1. Что сейчас отмечено */
	for (i = 0; i < groups.length; i++) {
		g = groups[i];
		g.selected = [];
		for (j = 0; j < g.items.length; j++) {
			if (g.items[j].input.checked) {
				g.selected.push(g.options[j]);
			}
		}
	}

	/* 2. Число товаров у каждого варианта; пустые варианты отключаем */
	for (i = 0; i < groups.length; i++) {
		g = groups[i];
		for (j = 0; j < g.options.length; j++) {
			n = 0;
			for (k = 0; k < products.length; k++) {
				if (matches(products[k], g.id) && g.get(products[k]) === g.options[j]) {
					n++;
				}
			}
			item = g.items[j];
			item.count.textContent = '(' + n + ')';
			off = (n === 0 && !item.input.checked);
			item.input.disabled = off;
			item.label.className = off ? 'disabled' : '';
		}
	}

	/* 3. Показываем подходящие товары */
	var list = [];
	for (k = 0; k < products.length; k++) {
		if (matches(products[k], '')) {
			list.push(products[k]);
		}
	}
	showProducts(list);
	foundText.textContent = 'Найдено: ' + list.length + ' из ' + products.length;
}

function resetFilters() {
	searchInput.value = '';
	for (var i = 0; i < groups.length; i++) {
		for (var j = 0; j < groups[i].items.length; j++) {
			groups[i].items[j].input.checked = false;
		}
	}
	update();
}

buildFilters();
searchInput.addEventListener('input', update);
resetButton.addEventListener('click', resetFilters);
update();
