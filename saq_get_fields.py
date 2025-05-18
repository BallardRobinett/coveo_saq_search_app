uri  = document.get_meta_data_value("clickableuri")[0]
log(f"start of extension script for {uri}")
product_number = uri.split('/')[-1]
if not product_number.isdigit():
    log(f"REJECTED: product number {product_number} contains non digit")
    document.reject()
product_number = int(product_number)

product_language = uri.split('/')[-2]

en_min_range = 15363000
en_max_range = 15369000

fr_min_range = 15363000
fr_max_range = 15369000

if product_language == "en":
    if not (en_min_range <= product_number <= en_max_range):
        log(f"REJECTED: product number {product_number} out of range for english")
        #document.reject()
elif product_language == "fr":
    if not (fr_min_range <= product_number <= fr_max_range):
        log(f"REJECTED: product number {product_number} out of range for french")
        #document.reject()
else:
    log(f"REJECTED: product_language {product_language} not fr or en")
    document.reject()

#image_url = document.get_meta_data_value("image.loc")[0]
#document.add_meta_data({'image_url':image_url})

#https://www.saq.com/media/wysiwyg/placeholder/category/06.png

image_url_metadata = document.get_meta_data_value("image.loc")
log(f"image_url_metadata: {image_url_metadata}")
if image_url_metadata:
    image_url = document.get_meta_data_value("image.loc")[0]
else:
    log(f"image_url_metadata not found")
    image_url = "https://www.saq.com/media/wysiwyg/placeholder/category/06.png"
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
    ret = float(cleaned) if cleaned else 0.0
    log(f"extract price on html_str: {html_str}. Returning {ret}")
    return ret

if document.get_meta_data_value("ec_price")[0]:
    ec_price = extract_price(document.get_meta_data_value("ec_price")[0])
else:
    ec_price = -1.0
document.add_meta_data({'ec_price':ec_price})

def extract_int(html_str):
    start = html_str.find('>') + 1
    end = html_str.find('<', start)
    number = html_str[start:end].strip()
    log(f"extract int on html_str: {html_str}. Returning {number}")
    return int(float(number))

product_availability_metadata = document.get_meta_data_value("product_availability")

log(f"product_availability_metadata: {product_availability_metadata}")

if product_availability_metadata:
    product_availability = extract_int(document.get_meta_data_value("product_availability")[0])
else:
    log(f"product_availability_metadata not found")
    product_availability = 0
document.add_meta_data({'product_availability':product_availability})

product_rating_metadata = document.get_meta_data_value("product_rating")

log(f"product_rating_metadata: {product_rating_metadata}")

if product_rating_metadata:
    product_rating = extract_int(document.get_meta_data_value("product_rating")[0])
else:
    log(f"product_rating_metadata not found")
    product_rating = 0
document.add_meta_data({'product_rating':product_rating})

category_1_metadata = document.get_meta_data_value("category_1")
category_2_metadata = document.get_meta_data_value("category_2")
category_3_metadata = document.get_meta_data_value("category_3")

log(f"\ncategory_1_metadata:\n {category_1_metadata}.\n category_2_metadata:\n {category_2_metadata}.\n category_3_metadata:\n {category_3_metadata}")

category_1 = document.get_meta_data_value("category_1")[0] if category_1_metadata else 0 
category_2 = document.get_meta_data_value("category_2")[0] if category_2_metadata else 0 
category_3 = document.get_meta_data_value("category_3")[0] if category_3_metadata else 0

log(f"\ncategory_1:\n {category_1}.\ncategory_2:\n {category_2}.\ncategory_3:\n {category_3}")

if category_1 and category_2 and category_3:
    category = f"{category_1};{category_1}|{category_2};{category_1}|{category_2}|{category_3};"
elif category_1 and category_2:
    category = f"{category_1};{category_1}|{category_2};"
elif category_1:
    category = f"{category_1};"
else:
    category = "no categories found"

log(f"\ncategory:\n {category}")
document.add_meta_data({'category':category})

def extract_title(html_str):
    ret = html_str.split('|')[0].strip()
    log(f"extract title on html_str: {html_str}. Returning {ret}")
    return ret


title_metadata = document.get_meta_data_value("title")

if title_metadata:
    title = extract_title(document.get_meta_data_value("title")[0])
else:
    log(f"title_metadata not found")
    title = "Product missing title"
document.add_meta_data({'product_name':title})

log("end of extension")