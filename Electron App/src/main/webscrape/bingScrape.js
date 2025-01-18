import puppeteer from "puppeteer";

async function bingScrape(query)
{
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
  
    // Navigate the page to a URL
    await page.goto(`https://www.bing.com/search?q=${query}`);

    await page.waitForNavigation();
    
    const result = await page.evaluate(() => {
        const listItems = document.querySelectorAll(`li.b_algo`); // Select all <li> elements with the given class name
        const data = [];
    
        listItems.forEach((li) => {
            const website = li.querySelector('div.tptt')?.textContent.trim() || '';
            const des = li.querySelector('p.b_lineclamp2')?.textContent.trim() || '';
            const title = li.querySelector('h2')?.textContent.trim() || ''; // Get the text content of the <div>
            const link = li.querySelector('a')?.href || ''; // Get the href of the <a>
            data.push({"website":website, "title":title, "description":des, "link": link });
        });
    
        return data;
    });

    await browser.close();

    return result;
}

export default bingScrape;