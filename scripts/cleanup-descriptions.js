const { slugify } = require("../functions");
const fs = require("fs");
const path = require("path");

const values = [
  {
    name: "Hrana uscata pisici",
    url: "https://www.petmart.ro/pisici/hrana-pisici/hrana-uscata-pisici.html#q=&idx=pm_default_products&p=0&dFR%5Bgreutate_pro_plan%5D%5B0%5D=2%20kg&hFR%5Bcategories.level0%5D%5B0%5D=Pisici%20%2F%2F%2F%20Hrana%20Pisici%20%2F%2F%2F%20Hrana%20uscata%20Pisici&is_v=1",
  },
  {
    name: "Hrana umeda pisici",
    url: "https://www.petmart.ro/pisici/hrana-pisici/hrana-umeda-pisici.html#q=&idx=pm_default_products&p=0&dFR%5Bgreutate_pro_plan%5D%5B0%5D=85%20g&dFR%5Bgreutate_pro_plan%5D%5B1%5D=100%20g&dFR%5Bgreutate_pro_plan%5D%5B2%5D=80%20g&dFR%5Bgreutate_pro_plan%5D%5B3%5D=70%20g&hFR%5Bcategories.level0%5D%5B0%5D=Pisici%20%2F%2F%2F%20Hrana%20Pisici%20%2F%2F%2F%20Hrana%20umeda%20Pisici&is_v=1",
  },
  {
    name: "Diete veterinare pisici",
    url: "https://www.petmart.ro/pisici/hrana-pisici/diete-veterinare-pisici.html",
  },
  {
    name: "Jucarii pisici",
    url: "https://www.petmart.ro/pisici/accesorii-pisici/accesorii-jucarii-pisici.html",
  },
  {
    name: "Antiparazitare externe pisici",
    url: "https://www.petmart.ro/pisici/farmacie-pisici/antiparazitare-pisici.html#q=&idx=pm_default_products&p=0&hFR%5Bcategories.level0%5D%5B0%5D=Pisici%20%2F%2F%2F%20Farmacie%20Pisici%20%2F%2F%2F%20Antiparazitare%20Pisici%20%2F%2F%2F%20Antiparazitare%20Externe%20Pisici&is_v=1",
  },
  {
    name: "Antiparazitare interne pisici",
    url: "https://www.petmart.ro/pisici/farmacie-pisici/antiparazitare-pisici.html#q=&idx=pm_default_products&p=0&hFR%5Bcategories.level0%5D%5B0%5D=Pisici%20%2F%2F%2F%20Farmacie%20Pisici%20%2F%2F%2F%20Antiparazitare%20Pisici%20%2F%2F%2F%20Antiparazitare%20Interne%20Pisici&is_v=1",
  },
  {
    name: "Suplimente afectiuni hepatice pisici",
    url: "https://www.petmart.ro/pisici/farmacie-pisici/afectiuni-hepatice-pisici.html",
  },
  {
    name: "Suplimente sistem digestiv pisici",
    url: "https://www.petmart.ro/pisici/farmacie-pisici/farmacie-suport-sistem-digestiv-pisici.html",
  },
  {
    name: "Suplimente afectiuni renale si urinare pisici",
    url: "https://www.petmart.ro/pisici/farmacie-pisici/afectiuni-renale-urinare-pisici.html",
  },
  {
    name: "Produse dermatologice pisici",
    url: "https://www.petmart.ro/pisici/farmacie-pisici/farmacie-produse-dermatologice-pisici.html",
  },
  {
    name: "Produse periaj pisici",
    url: "https://www.petmart.ro/pisici/igiena-pisici/igiena-articole-periaj-descalcit-pisici.html",
  },
  {
    name: "Nisip litiera pisici",
    url: "https://www.petmart.ro/pisici/igiena-pisici/igiena-nisip-igienic-litiere-pisici.html",
  },
  {
    name: "Forfecute si clesti pisici",
    url: "https://www.petmart.ro/pisici/igiena-pisici/igiena-pisici-forfecute-clesti-pisici.html",
  },
  {
    name: "Sampoane pisici",
    url: "https://www.petmart.ro/pisici/igiena-pisici/igiena-pisici-sampoane-pisici.html",
  },
  {
    name: "Produse igiena ochi si urechi pisici",
    url: "https://www.petmart.ro/pisici/igiena-pisici/pisici-igiena-igiena-ochi-urechi-pisica.html",
  },
];
const regexToRemove =
  /Animăluțele noastre merită toată dragostea pe care le-o putem oferi[\s\S]*$/;
function modifyDescription(description) {
  return description.replace(regexToRemove, "").trim();
}
async function cleanupDescriptions() {
  for (let category of values) {
    const folderName = `data/${slugify(category.name)}`;
    fs.readdir(folderName, (err, files) => {
      files.forEach((file) => {
        const filePath = path.join(folderName, file);
        fs.readFile(filePath, "utf-8", (err, data) => {
          let jsonData;
          try {
            jsonData = JSON.parse(data);
          } catch (err) {
            return console.error(`Error parsing JSON in file ${file}: ${err}`);
          }
          // Modify the description field
          if (jsonData.description) {
            jsonData.description = modifyDescription(jsonData.description);
          }
          fs.writeFile(
            filePath,
            JSON.stringify(jsonData, null, 2),
            "utf-8",
            (err) => {
              if (err) {
                return console.error(`Error writing file ${file}: ${err}`);
              }
              console.log(`File ${file} has been updated.`);
            }
          );
        });
      });
    });
  }
}

(async () => {
  await cleanupDescriptions();
})();
