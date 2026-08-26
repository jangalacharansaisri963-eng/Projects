import pandas as pd
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

# 1. Raw text data parsed into structured rows
data = [
    (1, 4, "IDY0646125", "APPANNA BABU TANGETI"),
    (2, 7, "IDY2649911", "ARUN KUMAR SELAMSETTY"),
    (3, 15, "IDY1098888", "KUMARAMMA POTTURU"),
    (4, 19, "IDY1132885", "VENKATA RAO GULLIPILLI"),
    (5, 27, "IDY1208552", "VASU BORA"),
    (6, 35, "IDY3161510", "SRI RAMA MURTHY KALLEPALLI"),
    (7, 40, "IDY3177474", "SAILAJA KALLEPALLI"),
    (8, 44, "IDY4007415", "BANGARU NAIDU KARRIMIJJI"),
    (9, 50, "IDY1209550", "VENKATESH REDDY RANGALA"),
    (10, 52, "IDY0709980", "RAJESHVARI PALIKEELA"),
    (11, 59, "IDY2332922", "SURYA RAO KOTIPALLI"),
    (12, 60, "IDY1208644", "SOBHA KOTIPALLI"),
    (13, 62, "IDY1467001", "VENKATESWARA RAO BOTTA"),
    (14, 66, "IDY3769478", "CHINNAMMULU POTNURU"),
    (15, 69, "IDY0563585", "LAKSHMI K"),
    (16, 76, "BGY1912047", "VIJAYA LAKSHMI VALLOORI"),
    (17, 76, "BGY6497051", "VELAMALA SRINIVAS RAO."),
    (18, 83, "IDY0904482", "RAMARAO POGIRI"),
    (19, 90, "IDY3066438", "VENKATA GNANENDRA KUMAR OMMI"),
    (20, 91, "IDY3595261", "Rajeswari Chigilipalli"),
    (21, 106, "IDY2843977", "RAMESH VENNU"),
    (22, 108, "IDY2843951", "KALPANA YENNU"),
    (23, 114, "IDY1098680", "KUMAR POTTURU"),
    (24, 119, "IDY1780221", "NANDU GORRELA"),
    (25, 122, "IDY0904607", "ASIRINAIDU DURGASI"),
    (26, 123, "IDY0909317", "DALAMMA DURGASI"),
    (27, 131, "IDY1551663", "NUKARAJU KOLLI"),
    (28, 144, "IDY3820941", "CHANDRAKALA TADIVALASA"),
    (29, 154, "IDY2149681", "LALITHA SAMPANGI"),
    (30, 155, "IDY4080966", "REDDI VENKATA RAMANA"),
    (31, 165, "IDY4004958", "RUPA DUKKA"),
    (32, 168, "AWU0625814", "CHIRANJEEVI SAMPANGI"),
    (33, 170, "XBO0976078", "NOOKA RAJU LAVETI"),
    (34, 175, "BFX2176220", "IPPILI GAYATHRI"),
    (35, 178, "IDY2030831", "ANURADHA OMMI"),
    (36, 179, "IDY2986040", "LAXMI MEESALA"),
    (37, 203, "IDY1760801", "TIRUPATI RAO DWARAPUREDD"),
    (38, 204, "IDY0909341", "LAKSHMI KALYANI VIYYAPU"),
    (39, 206, "IDY0610022", "Chittibabu ommi"),
    (40, 214, "IDY2711125", "VENKATA RAO BOYINA"),
    (41, 215, "IDY2711216", "NAGAMANI BOYINA"),
    (42, 216, "IDY1369404", "MANASA POGIRI"),
    (43, 217, "IDY0145102", "PRASADA RAO BAYYE"),
    (44, 218, "IDY0144071", "RUJUVELTU BAYYE"),
    (45, 228, "IDY0909416", "RAVANAMMA KALIGOTLA"),
    (46, 229, "IDY0909408", "PAIDAMMA BETHA"),
    (47, 231, "IDY1553198", "SANDHYA KOYYANNA"),
    (48, 236, "IDY2247253", "ANAND ALAJANGI"),
    (49, 237, "IDY2546943", "BALAKRISHNA URITI"),
    (50, 241, "IDY2729549", "SANTOSH KUMAR DEVARA"),
    (51, 244, "IDY1865999", "SURYANARAYANA RACHARLA"),
    (52, 257, "IDY2711448", "RAMYA BORA"),
    (53, 263, "IDY2350262", "CHINNA BATTU"),
    (54, 264, "IDY2350239", "RAMALAKSHMI BATTU"),
    (55, 265, "IDY2327600", "SATYA DURGA SIVARAM BATTU"),
    (56, 266, "IDY2350247", "ARUN KUMAR BATTU"),
    (57, 270, "IDY2931095", "NIRMALA BORA"),
    (58, 273, "IDY2443133", "GOVINDA RAO BANDARU"),
    (59, 277, "IDY2443166", "JANAKI BANDARU"),
    (60, 279, "IDY2949758", "GOWRI NAIDU GADI"),
    (61, 281, "IDY2711067", "VEERA VENKATA RAMANA SARIKA"),
    (62, 284, "IDY2658615", "POTHINA PREMA JYOTHI"),
    (63, 287, "IDY2712040", "SOWJANYA LATHA KOTTAKKI"),
    (64, 294, "IDY3829892", "Srinivasu Adari"),
    (65, 299, "BGY6487102", "DASARI VARAHANARASIMHA SWAMIY"),
    (66, 319, "IDY2436187", "GAUTAM DONKANA"),
    (67, 320, "IDY0766048", "APPALA VENKATA SAGAR BEVARA"),
    (68, 321, "IDY1208750", "RENUKA BEVARA"),
    (69, 322, "IDY0631127", "KARUNA KUMARI BEVARA"),
    (70, 324, "IDY3854221", "PREETHAM SURYA NARAYANA BEVARA"),
    (71, 325, "IDY3855434", "LAKSHMI MANYA BEVARA"),
    (72, 340, "IDY3325586", "ESWARA RAO MATTAPARTHI"),
    (73, 366, "IDY3813839", "UMA SANKAR DURGAVAJJALA"),
    (74, 367, "IDY1581900", "RAMANAMURTY YEMPADA"),
    (75, 386, "BGY1915560", "ESTHER RUPADATTI"),
    (76, 389, "IDY0907535", "UMA MAHESWARA RAO MALLA"),
    (77, 401, "IDY0907626", "APPARAO JAMMU"),
    (78, 415, "IDY2418508", "SURI BABU CHIPPADA"),
    (79, 429, "IDY1821447", "NARASAYAMMA CHIPPADA"),
    (80, 429, "BGY1906825", "VARALAKSHMI KOTRADA"),
    (81, 434, "BGY1881911", "LAKSHMANARAO KARAGANI"),
    (82, 436, "BGY1882133", "DURGAMMA KARAGANI"),
    (83, 441, "IDY2812600", "PYDI RAJU KANCHUMURTHY"),
    (84, 442, "IDY2826550", "KALYANI KANCHU MURTHY"),
    (85, 444, "IDY0400770", "RAMBABU RELLA"),
    (86, 459, "IDY3201837", "SYAM SUNDAR JONNADA"),
    (87, 474, "IDY2902831", "BANGARU BABU KADIMI"),
    (88, 493, "IDY2992063", "JHANSI BHAIRAVA JYOSHULA"),
    (89, 495, "IDY2645836", "LAKSHMI SOWMYA SAGI"),
    (90, 498, "IDY2667608", "RAJU GOWTHU"),
    (91, 503, "IDY0675165", "SUBHAN MOHAMMED SHA BUDDIN"),
    (92, 506, "IDY3955606", "Ajay Bhaba Rao Ramadevu"),
    (93, 507, "IDY0949859", "LAKSHMI RAMADEVU"),
    (94, 516, "IDY2149418", "JAGANMOHAN PEDIREDLA"),
    (95, 517, "IDY3792512", "YERRA VENKATA SATYAVATHI YERRA"),
    (96, 522, "IDY0887349", "VENKATA RAMAYA YENUMULA"),
    (97, 529, "IDY0058784", "SIMHADRI APPARAO KATTULA"),
    (98, 532, "IDY2061802", "KRISHNAVENI KAJULURI"),
    (99, 542, "IDY2830537", "Kiran Serakam"),
    (100, 545, "IDY0573204", "NAJUMUNNISA SYED"),
    (101, 547, "IDY3570900", "ZARINA BEGUM ZARINA"),
    (102, 549, "IDY0538306", "SAYAD RAJ KAMAL SHAIK"),
    (103, 550, "IDY0538298", "KADHAR MOHAMMAD"),
    (104, 552, "IDY2311439", "VENKATA RAMANAMMA SARAKAM"),
    (105, 553, "IDY2311447", "RAJESH KUMAR SARAKAM"),
    (106, 554, "BGY6171342", "RAMAMURTHY RAJU CHINTALAPATI"),
    (107, 559, "IDY1208032", "PERUMALLU RAJU BHUPATHI RAJU"),
    (108, 561, "IDY0759522", "PREMKUMARI BHUPATHIRAJU"),
    (109, 567, "IDY1875949", "VENKATA SIMHADRI RAJU KAKARLAPUDI K K"),
    (110, 569, "IDY3804549", "murali krishna moturu"),
    (111, 570, "IDY3804580", "radhika moturu"),
    (112, 584, "BGY6497200", "LAKSHMI DEVI KOLATI"),
    (113, 584, "IDY3256047", "TANUSHA PILLA"),
    (114, 591, "IDY1876079", "SIVA PRAKASH KONADA"),
    (115, 594, "IDY3075744", "SAI PRAKASH KARAMPUDI"),
    (116, 600, "IDY1724575", "YUGANDHAR BODDATI"),
    (117, 615, "IDY0766675", "MANOJ BHIMARASETTY"),
    (118, 620, "IDY2077148", "ANIL CHITTURI"),
    (119, 623, "BGY1911023", "VEERA VENKATA JANARDHAN UPPADA"),
    (120, 625, "IDY1127596", "APARNA UPPADA"),
    (121, 634, "IDY3987690", "Gopalakrishnayya Raghavapudi"),
    (122, 635, "IDY0641431", "AACHARI APPULABATTULA"),
    (123, 636, "IDY0601195", "MEENA APPULABATTULA"),
    (124, 639, "IDY0641498", "ABHISHEK APPULABATTULA"),
    (125, 642, "IDY3943743", "deepthi dasari"),
    (126, 643, "IDY0067884", "SAKUNTHALA SADARAM"),
    (127, 647, "IDY2957348", "SAILENDRA KUMAR PILLA"),
    (128, 651, "IDY0063909", "PREM CHAND JADA"),
    (129, 652, "IDY0070847", "SADHVI MANI JADA"),
    (130, 661, "IDY0910828", "MAHESWARARAO JAGARAPU"),
    (131, 663, "IDY0807230", "LAKSHMANA RAO PERI"),
    (132, 664, "IDY0807255", "PRABHAVATHI DEVI PERI"),
    (133, 665, "IDY0766360", "ANANDA RAO KILANI"),
    (134, 675, "IDY0896563", "NAGABHANU GUTTULA"),
    (135, 677, "IDY0767046", "SONI MAHAMMAD"),
    (136, 678, "IDY0761882", "MOHASIN MAHAMAD."),
    (137, 680, "IDY1103308", "SANTHISRI DUNNA"),
    (138, 685, "IDY1107101", "KRISHNA AYITHI REDD"),
    (139, 688, "IDY0064386", "Ganapathi Pericherla"),
    (140, 696, "IDY0528398", "Rama Murthy mantha"),
    (141, 698, "IDY3920683", "Satya Rama Jyothi Aripirala"),
    (142, 705, "IDY0793075", "DEEPTHI SRI THOLETI"),
    (143, 706, "IDY0428474", "V S SUBRAMANYA RAJA SHEKAR TOLETI"),
]

# 2. Create DataFrame
df = pd.DataFrame(data, columns=["S.No.", "Serial No.", "EPIC No.", "Elector's Name"])

# 3. Write to Excel using openpyxl engine
file_name = "electors_list.xlsx"
writer = pd.ExcelWriter(file_name, engine="openpyxl")
df.to_excel(writer, index=False, startrow=3, sheet_name="Electors")

# 4. Access workbook and sheet to add styling
workbook = writer.book
sheet = writer.sheets["Electors"]

# --- Styling definitions ---
font_family = "Segoe UI"

title_font = Font(name=font_family, size=14, bold=True, color="FFFFFF")
header_font = Font(name=font_family, size=11, bold=True, color="FFFFFF")
data_font = Font(name=font_family, size=10)
bold_data_font = Font(name=font_family, size=10, bold=True)

title_fill = PatternFill(
    start_color="1F4E78", end_color="1F4E78", fill_type="solid"
)
header_fill = PatternFill(
    start_color="2F5597", end_color="2F5597", fill_type="solid"
)
zebra_fill = PatternFill(
    start_color="F9FBFD", end_color="F9FBFD", fill_type="solid"
)

thin_border = Border(
    left=Side(style="thin", color="D9D9D9"),
    right=Side(style="thin", color="D9D9D9"),
    top=Side(style="thin", color="D9D9D9"),
    bottom=Side(style="thin", color="D9D9D9"),
)

# --- Add Title Block ---
sheet.merge_cells("A1:D1")
title_cell = sheet["A1"]
title_cell.value = "ELECTORS LIST"
title_cell.font = title_font
title_cell.fill = title_fill
title_cell.alignment = Alignment(horizontal="center", vertical="center")
sheet.row_dimensions[1].height = 35

# --- Style Column Headers (Row 4) ---
sheet.row_dimensions[4].height = 24
for col_num in range(1, 5):
    cell = sheet.cell(row=4, column=col_num)
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = Alignment(
        horizontal="center" if col_num < 4 else "left", vertical="center"
    )

# --- Style Data Rows ---
for row_num in range(5, len(df) + 5):
    sheet.row_dimensions[row_num].height = 19
    is_even = row_num % 2 == 0

    for col_num in range(1, 5):
        cell = sheet.cell(row=row_num, column=col_num)
        cell.font = data_font
        cell.border = thin_border

        # Zebra striping
        if is_even:
            cell.fill = zebra_fill

        # Alignments & Formatting
        if col_num in [1, 2]:  # S.No and Serial No
            cell.alignment = Alignment(horizontal="center", vertical="center")
        elif col_num == 3:  # EPIC No (Code format)
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.font = bold_data_font
        else:  # Name
            cell.alignment = Alignment(horizontal="left", vertical="center")

# --- Add Total Summary Row at the Bottom ---
total_row = len(df) + 5
sheet.row_dimensions[total_row].height = 22
sheet.cell(row=total_row, column=1, value="Total Electors:").font = Font(
    name=font_family, size=10, bold=True
)
sheet.cell(row=total_row, column=1).alignment = Alignment(
    horizontal="right", vertical="center"
)
sheet.merge_cells(
    start_row=total_row, start_column=1, end_row=total_row, end_column=3
)

total_val_cell = sheet.cell(row=total_row, column=4, value=len(df))
total_val_cell.font = Font(name=font_family, size=10, bold=True)
total_val_cell.alignment = Alignment(horizontal="left", vertical="center")

# --- Auto-fit Column Widths cleanly ---
for col in sheet.columns:
    max_len = 0
    col_letter = get_column_letter(col[0].column)
    for cell in col:
        if cell.row > 1:  # skip merged title row calculation
            if cell.value:
                max_len = max(max_len, len(str(cell.value)))
    sheet.column_dimensions[col_letter].width = max(max_len + 5, 12)

# Save the workbook
writer.close()
print(f"Professional Excel file '{file_name}' generated successfully!")
