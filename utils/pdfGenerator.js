const Fs = require('fs')
const Path = require('path')
const Util = require('util')
const puppeteer = require('puppeteer')
const Handlebars = require('handlebars')
const ReadFile = Util.promisify(Fs.readFile)


async function generatePDF(pagedata, assetPath, destinationPath) {
	console.log(arguments)
	pagedata.baseFilePath = assetPath
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.setViewport({ width: 1620, height: 926 });
	// await page.goto(pageURL, { timeout: 3000 });

	// get page details
	let data = await page.evaluate(() => {});

	const templatePath = Path.resolve('./public/pdfSource/index.html')
	const content = await ReadFile(templatePath, 'utf8')

	// compile and render the template with handlebars
	const template = Handlebars.compile(content)

	const html = template(pagedata)
	await page.setContent(html)

	const pdf = await page.pdf({ format: 'A4', path: destinationPath });

	console.log("pdf saved")
	browser.close()
	return destinationPath;
}

module.exports = generatePDF
