uri  = document.get_meta_data_value("clickableuri")[0]
product_number = uri.split('/')[-1]
if not product_number.isdigit():
    document.reject()
product_number = int(product_number)

product_language = uri.split('/')[-2]

en_min_range = 14090000
en_max_range = 14100000

fr_min_range = 14090000
fr_max_range = 14100000

if product_language == "en":
    if not (en_min_range <= product_number <= en_max_range):
        document.reject()
elif product_language == "fr":
    if not (fr_min_range <= product_number <= fr_max_range):
        document.reject()
else:
    document.reject()

image_url = document.get_meta_data_value("image.loc")[0]
document.add_meta_data({'image_url':image_url})

def extract_price(html_str):
    start = html_str.find('>') + 1
    end = html_str.find('<', start)
    content = html_str[start:end].strip()
    cleaned = ''
    for char in content:
        if char.isdigit() or char in ',.':
            cleaned += char
        elif cleaned:
            break
    if ',' in cleaned and '.' not in cleaned:
        cleaned = cleaned.replace(',', '.')
    return float(cleaned) if cleaned else 0.0

if document.get_meta_data_value("ec_price")[0]:
    price = extract_price(document.get_meta_data_value("ec_price")[0])
else:
    price = -1.0
document.add_meta_data({'ec_price':price})

def extract_int(html_str):
    start = html_str.find('>') + 1
    end = html_str.find('<', start)
    number = html_str[start:end].strip()
    return int(number)

if document.get_meta_data_value("availability")[0]:
    availability = extract_int(document.get_meta_data_value("availability")[0])
else:
    availability = 0
document.add_meta_data({'availability':availability})

if document.get_meta_data_value("rating")[0]:
    rating = extract_int(document.get_meta_data_value("rating")[0])
else:
    rating = 0
document.add_meta_data({'rating':rating})

category_1 = document.get_meta_data_value("category_1")[0]
category_2 = document.get_meta_data_value("category_2")[0]
category_3 = document.get_meta_data_value("category_3")[0]

if category_1 and category_2 and category_3:
    category = f"{category_1};{category_1}|{category_2};{category_1}|{category_2}|{category_3};"
elif category_1 and category_2:
    category = f"{category_1};{category_1}|{category_2};"
elif category_1:
    category = f"{category_1};"
else:
    category = "no categories found"

document.add_meta_data({'category':category})

title = document.get_meta_data_value("title")[0]
document.add_meta_data({'product_name':title})