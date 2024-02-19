import json
input_file = open("cards_datapoll.json", "r", encoding="utf-8")
data = json.load(input_file)

collections = {'total': 0}
nft = []
data_cards = {"common": {}, "funny": {}, "legendary": {}, "recomposed": {}, "memories": {}, "classified": {}, "deprecated": {}}

priority = {'deprecated': 0, 'common': 1, 'funny': 2, 'legendary': 3, 'recomposed': 4, 'memories': 5, 'classified': 6, 'nft': 7}
color = {'deprecated': '#cc0000', 'common': '#46bb0b', 'funny': '#d0c112', 'legendary': '#d07812', 'recomposed': '#3f46cf', 'memories': '#e24141', 'classified': '#dc41dd', 'nft': '#cc0000'}

cards_output = '# <center> Hibouden Cards Collection </center>\n\n## <center> Rarity </center>\n---\n- <span style="color:#46bb0b;">- **Common** -</span> (40% Chance)\n- <span style="color:#d0c112;">- **Funny** -</span> (25% Chance)\n- <span style="color:#d07812;">- **Legendary** -</span> (20% Chance)\n- <span style="color:#3f46cf;">- **Recomposed** -</span> (10% Chance)\n- <span style="color:#e24141;">- **Memories** -</span> (4% Chance)\n- <span style="color:#dc41dd;">- **Classified** -</span> (1% Chance)\n- <span style="color:#cc0000;">- **Deprecated** -</span> (Not Obtainable)\n---\n\n## <center> Collections </center>'

for card in data:
    if card['collection'] not in collections:
        collections[card['collection']] = 0
    collections[card['collection']] += 1
    collections['total'] += 1
    if card['rarity'] == 'NFT':
        nft.append(card['name'])
    card['img'] = card['img'].split('?')[0]
    data_cards[card['rarity'].lower()][card['id']] = card

cards_output += '\n---'
for collection in collections:
    cards_output += '\n- '+collection+' ('+str(collections[collection])+' Cartes)'
cards_output += '\n\n### '+str(collections['total'])+' Cartes (+'+str(len(nft))+' NFT) à collectionner\n---\n\n| Carte | Collection | Rareté | Valeur | État | Lien | ID |\n|-|-|-|-|-|-|-|'

data = sorted(data, key=lambda k: priority[k['rarity'].lower()])

cards_total = {'Common': 0, 'Funny': 0, 'Legendary': 0, 'Recomposed': 0, 'Memories': 0, 'Classified': 0, 'Deprecated': 0, 'NFT': 0, 'Total': 0}

for card in data:
    cards_output += '\n| '+card['name']+' | '+card['collection']+' | <center> <span style="color:'+color[card['rarity'].lower()]+';">- **'+str(card['rarity'])+'** -</span></center> | '+str(card['scrap'])+' | '+card['state']+' | [Image]('+card['img']+') | '+str(card['id'])+' |'
    cards_total[card['rarity']] += 1
    cards_total['Total'] += 1

for rarity in cards_total:
    print(rarity+' | '+str(cards_total[rarity]/cards_total['Total']*100)+'%')

output_file = open("Cards.md", "w", encoding="utf-8")
output_file.write(cards_output)

cards_file = open("cards.json", "w", encoding="utf-8")
cards_file.write(json.dumps(data_cards, indent=4, ensure_ascii=False))