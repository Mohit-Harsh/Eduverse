import puppeteer from "puppeteer";

async function bingScrape(querylist)
{
    // Launch the browser and open a new blank page
    const withBrowser = async (fn) => {
        const browser = await puppeteer.launch();
        try 
        {
            return await fn(browser);
        }
        catch(err)
        {
            console.log(err.message);
        }
        finally 
        {
            await browser.close();
        }
    }
    
    const withPage = (browser) => async (fn) => {
        const page = await browser.newPage();
        try 
        {
            return await fn(page);
        }
        catch(err)
        {
            console.log(err.message)
        } 
        finally 
        {
            await page.close();
        }
    }
    
    const results = await withBrowser(async (browser) => {
        return Promise.all(querylist.map(async (query) => {
            return withPage(browser)(async (page) => {

                await page.goto(`https://www.bing.com/search?q=${query['name']} ${query['type']}`);
    
                await page.waitForNavigation();
            
                const res = await page.evaluate(() => {
                    const listItems = document.querySelectorAll(`li.b_algo`); // Select all <li> elements with the given class name
                        
                    let data = [];
                    
                    listItems.forEach((li) => {
                        const website = li.querySelector('div.tptt')?.textContent.trim() || '';
                        const des = li.querySelector('p.b_lineclamp2')?.textContent.trim() || '';
                        const title = li.querySelector('h2')?.textContent.trim() || ''; // Get the text content of the <div>
                        const link = li.querySelector('a')?.href || ''; // Get the href of the <a>
                        data.push({"website":website, "title":title, "description":des, "link": link });
                    });
                
                    return data;
                });

                return {query:`${query['name']} (${query['type']})`,data:res.slice(0,5)};
            });

        }));
    });

    return results;
}

export default bingScrape;