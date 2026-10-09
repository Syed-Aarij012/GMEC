// Content for the "Areas We Serve" local-SEO pages (/led-lighting-london/[area]).
// Each entry mirrors the Newham page layout spec: hero, popular categories,
// trades & property teams, areas we supply, why buy from GMEC, FAQs, trade
// account CTA, and nearby-area links. Card titles/bodies are area-specific
// text supplied per page; `body` strings support the same markdown-lite
// "[text](url)" / "**bold**" syntax as the rest of the site.

export interface AreaCard {
  title: string;
  body: string;
}

export interface CategoryCard extends AreaCard {
  image: string;
}

export interface AreaPageData {
  slug: string;
  name: string;
  title: string;
  description: string;
  heroIntro: string[];
  heroImage: string;
  heroAlt: string;
  categoriesIntro: string;
  categories: CategoryCard[];
  tradeTeamsHeading: string;
  tradeTeams: AreaCard[];
  areasWeSupply: AreaCard[];
  whyBuy: AreaCard[];
  faqs: AreaCard[];
  tradeCtaIntro: string;
  nearbyAreas: string[];
}

const CATEGORY_IMAGES = {
  gu10: "/uploads/products/chrome_downlight_banner_3-gold.webp",
  filament: "/uploads/products/GMEC-LED-LIhts-UK-Lights-01-9-scaled-2.png",
  ceiling: "/uploads/products/led_panel_product_1-gold.webp",
  rgb: "/uploads/products/GMEC-LED-LIhts-UK-Lights-01-17-scaled.png",
  smart: "/uploads/products/GMEC-LED-LIhts-UK-Lights-01-5-scaled.png",
  candle: "/uploads/products/GMEC-LED-LIhts-UK-Lights-01-7-scaled.png",
  frosted: "/uploads/products/GMEC-LED-LIhts-UK-Lights-01-3-scaled-2-3.png",
  coolWhite: "/uploads/products/GMEC-LED-LIhts-UK-Lights-01-25-scaled.png",
} as const;

const WHY_BUY_TEMPLATE = (pricingLine: string): AreaCard[] => [
  { title: "Trade and Retail Pricing", body: pricingLine },
  { title: "Free UK Delivery Over £100 +VAT", body: "Add everything you need to one basket and unlock free delivery." },
  { title: "14-Day Returns", body: "A simple, hassle-free returns process if something is not right." },
  { title: "24/7 Support", body: "Real people ready to help with fittings, wattage and colour temperature." },
];

export const areaPages: Record<string, AreaPageData> = {
  newham: {
    slug: "newham",
    name: "Newham",
    title: "LED Lighting Supplier Near Newham | GU10, Filament, Ceiling",
    description:
      "Trade and retail LED bulbs, GU10 downlights, ceiling lights and smart gadgets near Newham. Free UK delivery over £100 +VAT. Open a trade account today.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart home gadgets to homeowners, electricians and property professionals near Newham. Our base is on Keppel Road, East Ham, so we sit close to the rental homes, refurbishments and new-build schemes that keep this part of East London busy.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat purchasing on bulk lighting jobs.",
    ],
    heroImage: CATEGORY_IMAGES.gu10,
    heroAlt: "Electrician fitting GU10 downlights near Newham",
    categoriesIntro: "Start with the products that Newham landlords, builders and homeowners buy most often.",
    categories: [
      { title: "GU10 Downlights for Flats, Kitchens and Hallways", image: CATEGORY_IMAGES.gu10, body: "Fit out ceilings quickly with reliable [GU10 downlights](/shop/gu10-downlights) supplied from East Ham. Choose fire rated GU10 downlights where ceiling fire protection matters, or a GU10 bathroom downlight for wet areas. Popular with landlords and electricians refurbishing near Forest Gate and Plaistow." },
      { title: "LED Filament Bulbs for Cafes, Bars and Living Rooms", image: CATEGORY_IMAGES.filament, body: "Get the classic glow without the heat from [LED filament bulbs](/shop/led-filament-bulbs). Shop vintage filament bulbs and an E27 filament bulb for pendant lights near Stratford and the Royal Docks, or smaller E14 styles for compact fittings." },
      { title: "LED Ceiling Lights for New-Build Flats", image: CATEGORY_IMAGES.ceiling, body: "Light up new-build homes near Canning Town with [LED ceiling lights](/shop/led-ceiling-lights) that install fast. Browse bedroom LED ceiling lights and living room ceiling lights LED options in warm or cool white, ideal when fitting out several units at once." },
      { title: "RGB LED Strip Lights for Gaming Rooms and Feature Walls", image: CATEGORY_IMAGES.rgb, body: "Add colour to bars, bedrooms and feature walls near Stratford with [RGB LED strip lights](/shop/led-rgb-lights). Our LED RGB lights range suits under-cabinet, shelf and TV backlighting, including 12V RGB LED strip lights." },
      { title: "Smart Home Gadgets for Safer Rental Homes", image: CATEGORY_IMAGES.smart, body: "Make homes safer and easier to manage with [smart home gadgets](/shop/smart-gadgets), from smoke alarms to carbon monoxide detectors. Landlords near Plaistow and Forest Gate use smart gadgets for home safety, while homeowners add useful devices around the house." },
      { title: "LED Candle Bulbs for Chandeliers and Wall Lights", image: CATEGORY_IMAGES.candle, body: "Replace tired chandelier and wall light bulbs with [LED candle bulbs](/shop/led-candle-bulbs). A dimmable LED candle bulb suits dining rooms and hallways, and B22 bulb options cover bayonet fittings near East Ham and Upton Park." },
      { title: "Frosted LED Bulbs for Soft, Glare-Free Light", image: CATEGORY_IMAGES.frosted, body: "Cut glare in bedrooms and offices with [frosted LED bulbs](/shop/led-frosted-bulbs) that spread light softly. Compare clear vs frosted LED bulbs, and look for frosted dimmable LED bulbs when you want smooth, comfortable light." },
      { title: "Cool White LED Bulbs for Kitchens, Garages and Workspaces", image: CATEGORY_IMAGES.coolWhite, body: "Wondering what colour a cool white bulb is? [Cool white LED bulbs](/shop/cool-white-led-bulbs) give a crisp, daylight-style white around 6500K, a strong fit for kitchens, garages and workspaces near Stratford." },
    ],
    tradeTeamsHeading: "LED Lighting for Newham Trades and Property Teams",
    tradeTeams: [
      { title: "Electrical Contractors", body: "Keep jobs moving with one supplier for downlights, bulbs and alarms. Trade accounts make repeat orders simple for contractors working near East Ham, Upton Park and Plaistow." },
      { title: "Landlords and Lettings Agents", body: "Newham has a large rental market, so lighting repairs and safety upgrades come up often. Stock up on bulbs, fittings and alarms for void turnarounds and routine maintenance." },
      { title: "Property Developers", body: "New-build and conversion schemes near Stratford, Canning Town and the Royal Docks need consistent lighting across many units. Talk to us about bulk quantities for your next phase." },
      { title: "Hotels and Hospitality", body: "Hotels, restaurants and bars near the Royal Docks and Stratford need warm, dependable lighting that lasts. Our LED range helps cut replacement time and running costs." },
      { title: "Offices and Retail Stores", body: "Bright, even lighting keeps workspaces and shop floors comfortable. Explore panel lights, ceiling lights and cool white bulbs for commercial fit-outs." },
    ],
    areasWeSupply: [
      { title: "East Ham", body: "Our home base on Keppel Road. Homeowners and local trades can order online or contact us about trade pricing." },
      { title: "Upton Park", body: "Terraced homes and shopfronts near Green Street often need bulb replacements and fitting upgrades. We stock the common GU10, E14, E27 and B22 fittings." },
      { title: "Plaistow", body: "A busy area for refurbishment and landlord maintenance. Downlights, ceiling lights and smoke alarms are popular here." },
      { title: "Forest Gate", body: "Period terraces and converted flats make Forest Gate a steady source of lighting upgrades, from filament bulbs to LED ceiling lights." },
      { title: "Stratford", body: "New-build flats, hotels and leisure venues near Stratford need everything from candle bulbs to RGB strip lights. Bulk orders welcome." },
      { title: "Canning Town", body: "Regeneration near Canning Town means ongoing fit-outs. Contractors can pair ceiling lights with GU10 downlights for full-unit lighting." },
      { title: "Royal Docks", body: "Offices, apartments and hospitality near the Royal Docks can order durable LED lighting with free UK delivery over £100 +VAT." },
    ],
    whyBuy: WHY_BUY_TEMPLATE("Competitive prices for homeowners and trade customers. Ask about a trade account for repeat orders."),
    faqs: [
      { title: "Do you supply trade customers near Newham?", body: "Yes. We supply electrical contractors, landlords, developers and hospitality businesses. [Contact us](/contact) to open a trade account." },
      { title: "Which GU10 downlight suits a bathroom?", body: "Bathroom lighting needs a suitable IP rating for the zone where it is fitted. Check the product specification and ask a qualified electrician to confirm what your bathroom needs." },
      { title: "What is the difference between warm white and cool white LED bulbs?", body: "Warm white (around 2700K to 3000K) gives a cosy, yellow-toned light for living rooms and bedrooms. Cool white (around 6500K) gives a crisp, daylight-style light for kitchens, garages and workspaces." },
      { title: "Is delivery free?", body: "Delivery is free across the UK on orders over £100 +VAT." },
      { title: "Can I return LED bulbs I no longer need?", body: "Yes. We offer 14-day returns. See our [refund and returns policy](/refund-returns-policy) for details." },
    ],
    tradeCtaIntro: "Need LED lighting for a Newham project? Speak to our team about trade pricing, bulk orders and repeat supply.",
    nearbyAreas: ["barking-and-dagenham", "redbridge", "tower-hamlets", "waltham-forest"],
  },

  "barking-and-dagenham": {
    slug: "barking-and-dagenham",
    name: "Barking and Dagenham",
    title: "LED Lighting Supplier Near Barking and Dagenham | GU10, Filament, Ceiling",
    description:
      "Trade and retail LED bulbs, GU10 downlights, ceiling lights and smart gadgets near Barking and Dagenham. Free UK delivery over £100 +VAT. Open a trade account today.",
    heroIntro: [
      "[GMEC Corporation](/) supplies trade and retail LED lighting to housing teams, electricians, builders and homeowners near Barking and Dagenham. We are based just up the road on Keppel Road, East Ham, which makes us a practical local source for maintenance work, new-build fit-outs and everyday bulb replacements.",
      "Order online with free UK delivery on orders over £100 +VAT.",
    ],
    heroImage: CATEGORY_IMAGES.gu10,
    heroAlt: "Electrician fitting GU10 downlights near Barking and Dagenham",
    categoriesIntro: "Housing associations, contractors and homeowners near Barking and Dagenham choose from these best-selling categories.",
    categories: [
      { title: "GU10 Downlights for Housing Maintenance and Refurbs", image: CATEGORY_IMAGES.gu10, body: "Keep repair schedules on track with dependable [GU10 downlights](/shop/gu10-downlights). Fire-rated GU10 downlights are available for ceilings that need protection, and each GU10 downlight fitting suits quick, repeatable installs across many homes near Becontree and Barking." },
      { title: "LED Filament Bulbs for Homes and Hospitality", image: CATEGORY_IMAGES.filament, body: "Bring warm, decorative light to lounges, cafes and pubs with [LED filament bulbs](/shop/led-filament-bulbs). Filament light bulbs in E27 and E14 sizes replace old incandescent lamps and last far longer, a smart saving for managers near Dagenham Heathway." },
      { title: "LED Ceiling Lights for New-Build Homes", image: CATEGORY_IMAGES.ceiling, body: "Fit out new homes near Barking Riverside with [LED ceiling lights](/shop/led-ceiling-lights) that are quick to install and easy to repeat. LED ceiling lighting suits hallways, bedrooms and open-plan living areas, with LED ceiling fixtures for larger rooms." },
      { title: "RGB LED Strip Lights for Bedrooms and Entertainment Spaces", image: CATEGORY_IMAGES.rgb, body: "Create mood lighting behind TVs, beds and shelving with [RGB LED strip lights](/shop/led-rgb-lights). Light RGB LED options and LED strip RGB lights make a low-cost upgrade for homes near Barking." },
      { title: "Smart Home Gadgets for Safer Housing", image: CATEGORY_IMAGES.smart, body: "Protect residents with [smart home gadgets](/shop/smart-gadgets) including smoke alarms and carbon monoxide detectors. Smart gadgets for home use are a useful addition to safety checks across managed properties near Dagenham." },
      { title: "LED Candle Bulbs for Lamps and Decorative Fittings", image: CATEGORY_IMAGES.candle, body: "Refresh decorative fittings with [LED candle bulbs](/shop/led-candle-bulbs). A candle LED bulb in E14 suits wall lights and lamps, and candelabra bulbs bring a traditional look to dining rooms near Becontree." },
      { title: "Frosted LED Bulbs for Comfortable Everyday Light", image: CATEGORY_IMAGES.frosted, body: "Choose [frosted LED bulbs](/shop/led-frosted-bulbs) when you want light without harsh glare. A frost LED bulb works well in bedrooms, hallways and communal areas, and frosted filament LED bulbs add a softer vintage look." },
      { title: "Cool White LED Bulbs for Garages, Stairwells and Workspaces", image: CATEGORY_IMAGES.coolWhite, body: "Understand the cool white colour temperature before you buy. [Cool white LED bulbs](/shop/cool-white-led-bulbs) sit around 6500K and look bright and bluish-white, which suits stairwells, garages and utility spaces near Barking." },
    ],
    tradeTeamsHeading: "LED Lighting for Barking and Dagenham Trades and Housing Teams",
    tradeTeams: [
      { title: "Housing Associations and Maintenance Teams", body: "Repair and void teams need predictable stock. Order bulbs, downlights and alarms in bulk and keep vans stocked for jobs near Barking, Dagenham and Becontree." },
      { title: "Electrical Contractors", body: "Rewires, extensions and upgrades all need dependable parts. A trade account gives contractors one supplier for lighting, fittings and safety devices." },
      { title: "Property Developers", body: "Large schemes near Barking Riverside need consistent lighting across many homes. Contact us to plan volumes and repeat supply." },
      { title: "Landlords and Lettings Agents", body: "Keep rental homes bright and compliant with simple, affordable LED replacements and smoke and CO alarms." },
      { title: "Schools and Community Buildings", body: "Hall, classroom and corridor lighting adds up on the energy bill. LED upgrades cut running costs and reduce replacement visits." },
    ],
    areasWeSupply: [
      { title: "Barking", body: "Barking town centre sits only a short drive from East Ham. Local trades and shops can order supplies fast online." },
      { title: "Barking Riverside", body: "A large new-build neighbourhood with ongoing fit-outs. Developers and contractors can source ceiling lights, downlights and bulbs for repeat phases." },
      { title: "Dagenham", body: "From Heathway to Dagenham Dock, homes, workshops and small businesses use LED lighting to bring down energy costs." },
      { title: "Becontree", body: "Becontree's many family homes need regular lighting upkeep. Bulbs, ceiling lights and alarms are easy to order for estates and individual owners alike." },
    ],
    whyBuy: WHY_BUY_TEMPLATE("Fair pricing for housing teams, contractors and homeowners. Ask about a trade account for ongoing supply."),
    faqs: [
      { title: "Can housing teams open a trade account near Barking and Dagenham?", body: "Yes. We support housing associations, contractors and developers. [Contact our team](/contact) to discuss bulk pricing and repeat orders." },
      { title: "What does fire rated mean for a GU10 downlight?", body: "A fire rated downlight is designed to help maintain a ceiling's fire resistance when it is fitted. Always follow the manufacturer's instructions and use a qualified electrician for installation." },
      { title: "Are LED filament bulbs dimmable?", body: "Some are, and some are not. Check the product page for dimming details and use a compatible dimmer." },
      { title: "Which bulb fitting do I need?", body: "Check the cap on your existing bulb. Common types include GU10, E14, E27 and B22. You can also use the [Shop by Fitting](/shop) filters." },
      { title: "Do you offer delivery near Barking and Dagenham?", body: "We deliver across the UK, with free delivery on orders over £100 +VAT." },
    ],
    tradeCtaIntro: "Planning maintenance or a new-build fit-out? Our team can help with trade pricing, bulk quantities, and regular supply.",
    nearbyAreas: ["newham", "redbridge", "tower-hamlets", "waltham-forest"],
  },

  redbridge: {
    slug: "redbridge",
    name: "Redbridge",
    title: "LED Lighting Supplier Near Redbridge | GU10, Filament, Ceiling",
    description:
      "Trade and retail LED bulbs, GU10 downlights, ceiling lights and smart gadgets near Redbridge. Free UK delivery over £100 +VAT. Open a trade account today.",
    heroIntro: [
      "[GMEC Corporation](/) helps landlords, letting agents, electricians and homeowners near Redbridge find the right LED lighting at trade and retail prices. From our East Ham base, we supply bulbs, downlights, ceiling lights and safety gadgets for the busy rental market and independent trades around Ilford, Seven Kings and Goodmayes.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat supply.",
    ],
    heroImage: CATEGORY_IMAGES.gu10,
    heroAlt: "Electrician fitting GU10 downlights near Redbridge",
    categoriesIntro: "Landlords and independent electricians near Redbridge reach for these categories first.",
    categories: [
      { title: "GU10 Downlights for HMOs, Flats and Conversions", image: CATEGORY_IMAGES.gu10, body: "Choose [GU10 downlights](/shop/gu10-downlights) for shared houses and converted flats. A GU10 downlight is easy to replace, and fire rated GU10 downlights help preserve ceiling protection. GU10 bathroom downlights suit wet rooms near Ilford and Seven Kings." },
      { title: "LED Filament Bulbs for Restaurants and Period Homes", image: CATEGORY_IMAGES.filament, body: "Add character to restaurants and period homes near Ilford with [LED filament bulbs](/shop/led-filament-bulbs). LED light bulbs filament style give a vintage glow, and an E27 filament bulb fits many pendant lights." },
      { title: "LED Ceiling Lights for Bedrooms and Shared Spaces", image: CATEGORY_IMAGES.ceiling, body: "Keep rooms bright with [LED ceiling lights](/shop/led-ceiling-lights). Bedroom LED ceiling lights and living room ceiling lights are simple to fit between tenancies near Goodmayes." },
      { title: "RGB LED Strip Lights for Salons, Shops and Bedrooms", image: CATEGORY_IMAGES.rgb, body: "Make shopfronts, salons and teen bedrooms stand out with [RGB LED strip lights](/shop/led-rgb-lights). An RGB LED strip lights kit adds colour behind counters, mirrors and shelves near Ilford." },
      { title: "Smart Home Gadgets for Landlord Safety Checks", image: CATEGORY_IMAGES.smart, body: "Support your compliance checks with [smart home gadgets](/shop/smart-gadgets) such as smoke alarms and carbon monoxide detectors. Smart gadgets for home use are popular with landlords near Seven Kings. Always check current regulations for your property type." },
      { title: "LED Candle Bulbs for Wall Lights and Chandeliers", image: CATEGORY_IMAGES.candle, body: "Swap out old bulbs in chandeliers and wall lights with [LED candle bulbs](/shop/led-candle-bulbs). Dimmable LED candle bulbs let you set the mood, and an LED candle bulb in E14 suits most decorative fittings." },
      { title: "Frosted LED Bulbs for Tenant-Friendly Lighting", image: CATEGORY_IMAGES.frosted, body: "Soft, even light keeps tenants happy. [Frosted LED bulbs](/shop/led-frosted-bulbs) reduce glare in bedrooms and living areas, and frosted dimmable LED bulbs give extra control where a dimmer is fitted." },
      { title: "Cool White LED Bulbs for Kitchens and Utility Rooms", image: CATEGORY_IMAGES.coolWhite, body: "Cool white colour temperature is typically around 6500K. [Cool white LED bulbs](/shop/cool-white-led-bulbs) look clean and bright, which makes them popular for kitchens, communal halls and utility rooms near Goodmayes." },
    ],
    tradeTeamsHeading: "LED Lighting for Redbridge Landlords, Trades and Businesses",
    tradeTeams: [
      { title: "Landlords and HMO Operators", body: "Shared houses wear through bulbs quickly. Keep a stock of standard fittings and alarms so repairs between tenancies stay quick and low cost." },
      { title: "Letting Agents and Property Managers", body: "Manage multiple properties with a single supplier. A trade account supports bulk orders and regular maintenance runs near Ilford." },
      { title: "Independent Electricians", body: "Small teams need reliable stock without long waits. Order downlights, ceiling lights and bulbs online and keep the van ready." },
      { title: "Restaurants, Salons and Shops", body: "Ilford's busy high streets and local parades rely on bright, attractive lighting. LED upgrades cut energy costs and replacement time." },
      { title: "Schools and Care Settings", body: "Reliable lighting supports safe, comfortable spaces. Ask us about LED upgrades for classrooms and communal areas." },
    ],
    areasWeSupply: [
      { title: "Ilford", body: "Ilford has a large mix of flats, shops and restaurants. Contractors and landlords near Ilford can order everything from GU10 bulbs to ceiling lights online." },
      { title: "Seven Kings", body: "Terraced homes and shared houses near Seven Kings often need quick lighting fixes. Common fittings are easy to find in our shop by fitting type." },
      { title: "Goodmayes", body: "Family homes and rental properties near Goodmayes benefit from low-energy LED bulbs and dependable alarms." },
    ],
    whyBuy: WHY_BUY_TEMPLATE("Competitive pricing for landlords, agents, contractors and homeowners. Ask about trade accounts."),
    faqs: [
      { title: "Do you supply landlords near Redbridge?", body: "Yes. We supply landlords, agents and property managers with LED bulbs, downlights, ceiling lights and alarms. [Contact us](/contact) to set up a trade account." },
      { title: "Which downlights are suitable for an HMO?", body: "HMO requirements can vary, so check your local authority guidance and speak to a qualified electrician. Fire rated GU10 downlights are a common choice where ceiling fire protection matters." },
      { title: "Do you sell smoke and carbon monoxide alarms?", body: "Yes. Browse our [smart gadgets](/shop/smart-gadgets) range for smoke alarms and carbon monoxide alarms with long-life batteries." },
      { title: "What is the difference between clear and frosted LED bulbs?", body: "Clear bulbs give a sharper, more decorative look, especially with filament styles. Frosted bulbs spread light softly and reduce glare." },
      { title: "Is there a minimum order for trade customers?", body: "Contact our team to discuss quantities, pricing and repeat supply for your business." },
    ],
    tradeCtaIntro: "Managing lettings or running jobs near Redbridge? We can help with trade pricing, bulk orders and quick restocks.",
    nearbyAreas: ["newham", "barking-and-dagenham", "tower-hamlets", "waltham-forest"],
  },

  "tower-hamlets": {
    slug: "tower-hamlets",
    name: "Tower Hamlets",
    title: "LED Lighting Supplier Near Tower Hamlets | GU10, Filament, Ceiling",
    description:
      "Trade and retail LED bulbs, GU10 downlights, ceiling lights and smart gadgets near Tower Hamlets. Free UK delivery over £100 +VAT. Open a trade account today.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED lighting to hotels, offices, developers and homeowners near Tower Hamlets. From our East Ham base, we help projects around Poplar, Bow and Canary Wharf source dependable downlights, ceiling lights, decorative bulbs and smart gadgets at trade and retail prices.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for fit-outs and ongoing facilities supply.",
    ],
    heroImage: CATEGORY_IMAGES.gu10,
    heroAlt: "Electrician fitting GU10 downlights near Tower Hamlets",
    categoriesIntro: "Hotels, offices and apartment schemes near Tower Hamlets often start with these categories.",
    categories: [
      { title: "GU10 Downlights for Hotel Corridors and Apartments", image: CATEGORY_IMAGES.gu10, body: "Light corridors, lobbies and apartments with consistent [GU10 downlights](/shop/gu10-downlights). Fire rated downlights GU10 and a GU10 downlight fitting for each room type keep fit-outs simple near Canary Wharf and Poplar." },
      { title: "LED Filament Bulbs for Bars, Restaurants and Lobbies", image: CATEGORY_IMAGES.filament, body: "Create a warm, upmarket atmosphere with [LED filament bulbs](/shop/led-filament-bulbs). Filament bulb styles and vintage filament bulbs suit bars and restaurants near Bow and Canary Wharf, while an E27 filament bulb fits many statement pendants." },
      { title: "LED Ceiling Lights for Offices and Serviced Apartments", image: CATEGORY_IMAGES.ceiling, body: "Brighten workspaces and serviced apartments with [LED ceiling lights](/shop/led-ceiling-lights). Ceiling lights LED and LED ceiling fixtures give even coverage and fast installs for property teams near Canary Wharf." },
      { title: "RGB LED Strip Lights for Bars, Venues and Display Lighting", image: CATEGORY_IMAGES.rgb, body: "Add colour to bar backs, retail displays and event spaces with [RGB LED strip lights](/shop/led-rgb-lights). Choose RGB LED lights and 12V RGB LED strip lights for creative feature lighting near Poplar and Bow." },
      { title: "Smart Home Gadgets for Serviced Apartments and Short Lets", image: CATEGORY_IMAGES.smart, body: "Equip apartments with [smart home gadgets](/shop/smart-gadgets) including alarms and everyday smart devices. Smart gadgets and gadgets for a smart home are a handy extra for hosts and managers near Canary Wharf." },
      { title: "LED Candle Bulbs for Chandeliers and Statement Fittings", image: CATEGORY_IMAGES.candle, body: "Keep statement fittings sparkling with [LED candle bulbs](/shop/led-candle-bulbs). Dimmable LED bulbs candle styles help hotels and restaurants set the right mood, and E14 candle bulbs fit many chandeliers and wall lights." },
      { title: "Frosted LED Bulbs for Comfortable Guest Rooms", image: CATEGORY_IMAGES.frosted, body: "Soften the light in guest rooms and lounges with [frosted LED bulbs](/shop/led-frosted-bulbs). Frosted dimmable LED bulbs help create a calm atmosphere without harsh glare." },
      { title: "Cool White LED Bulbs for Back-of-House and Workspaces", image: CATEGORY_IMAGES.coolWhite, body: "Choose [cool white LED bulbs](/shop/cool-white-led-bulbs) for kitchens, stock rooms and offices where clear visibility matters. Cool white is a bright, bluish-white light around 6500K, so many managers ask what colour is cool white LED before they order." },
    ],
    tradeTeamsHeading: "LED Lighting for Tower Hamlets Hotels, Offices and Developers",
    tradeTeams: [
      { title: "Hotels and Hospitality", body: "Hotels and restaurants near Canary Wharf rely on lighting that looks good and lasts. Order a consistent range for rooms, corridors and public spaces." },
      { title: "Offices and Workspaces", body: "Even, glare-free lighting supports productivity. Pair LED ceiling lights with cool white bulbs for clear, comfortable workspaces." },
      { title: "Property Developers", body: "Large schemes near Poplar and Bow need repeatable lighting specifications. Speak to us about bulk supply across phases." },
      { title: "Property Management Teams", body: "Keep estates, blocks and serviced apartments lit with simple, low-maintenance LED replacements." },
      { title: "Retail Stores", body: "Bright product displays drive sales. LED downlights and RGB strips help shops stand out near busy streets." },
    ],
    areasWeSupply: [
      { title: "Poplar", body: "Poplar combines new developments with established homes and local businesses. We supply the bulbs, downlights, and alarms projects here need." },
      { title: "Bow", body: "Bow's mix of period houses and modern flats means plenty of upgrade work. Filament bulbs, candle bulbs and ceiling lights are popular choices." },
      { title: "Canary Wharf", body: "Hotels, offices and apartments near Canary Wharf need dependable lighting at scale. Contact us for trade pricing and bulk quantities." },
    ],
    whyBuy: WHY_BUY_TEMPLATE("Competitive pricing for businesses, contractors and homeowners. Ask about trade accounts for repeat supply."),
    faqs: [
      { title: "Do you supply hotels and offices near Tower Hamlets?", body: "Yes. We work with hotels, offices, retailers and property teams. [Contact us](/contact) to discuss bulk orders and trade pricing." },
      { title: "Which colour temperature suits an office?", body: "Many offices use cool white light, around 6500K, for a bright and alert feel. Some prefer a neutral tone, so check samples if you are unsure." },
      { title: "Can I dim LED candle bulbs?", body: "Some LED candle bulbs are dimmable. Check the product page and use a compatible dimmer for best results." },
      { title: "How do I choose between clear and frosted LED bulbs?", body: "Clear bulbs highlight decorative filaments, while frosted bulbs spread light softly. Our guide to clear vs frosted LED bulbs can help you decide." },
      { title: "Can you support phased fit-outs?", body: "Yes. Talk to our team about quantities and repeat orders for phased projects." },
    ],
    tradeCtaIntro: "Planning a fit-out near Tower Hamlets? We can help with trade pricing, bulk quantities and repeat supply.",
    nearbyAreas: ["newham", "barking-and-dagenham", "redbridge", "waltham-forest"],
  },

  "waltham-forest": {
    slug: "waltham-forest",
    name: "Waltham Forest",
    title: "LED Lighting Supplier Near Waltham Forest | GU10, Filament, Ceiling",
    description:
      "Trade and retail LED bulbs, GU10 downlights, ceiling lights and smart gadgets near Waltham Forest. Free UK delivery over £100 +VAT. Open a trade account today.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart gadgets to homeowners, builders and electricians near Waltham Forest. Many homes around Leyton, Walthamstow and Leytonstone are older terraces being renovated, so we focus on practical lighting that suits period features, extensions and modern upgrades alike.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for regular renovation supply.",
    ],
    heroImage: CATEGORY_IMAGES.filament,
    heroAlt: "Vintage-style LED filament bulb fitted in a period home near Waltham Forest",
    categoriesIntro: "Renovators and homeowners near Waltham Forest pick from these categories most often.",
    categories: [
      { title: "LED Filament Bulbs for Period Features and Pendants", image: CATEGORY_IMAGES.filament, body: "Show off original ceiling roses and exposed pendants with [LED filament bulbs](/shop/led-filament-bulbs). Vintage filament bulbs and an E27 filament bulb give an authentic look with far lower running costs, ideal for terraced homes near Walthamstow Village." },
      { title: "LED Candle Bulbs for Original Fittings and Wall Lights", image: CATEGORY_IMAGES.candle, body: "Keep original chandeliers and wall lights working beautifully with [LED candle bulbs](/shop/led-candle-bulbs). A dimmable LED candle bulb and traditional candelabra bulbs suit period lounges and dining rooms near Leyton." },
      { title: "GU10 Downlights for Extensions, Lofts and Kitchens", image: CATEGORY_IMAGES.gu10, body: "Light new extensions, loft conversions and kitchens with [GU10 downlights](/shop/gu10-downlights). Fire rated GU10 downlights and a GU10 downlight fitting for each room make renovation work straightforward near Leytonstone." },
      { title: "LED Ceiling Lights for Bedrooms and Living Rooms", image: CATEGORY_IMAGES.ceiling, body: "Replace dated fittings with clean, modern [LED ceiling lights](/shop/led-ceiling-lights). Bedroom LED ceiling lights and living room ceiling lights LED options give even light after a redecoration near Walthamstow." },
      { title: "Frosted LED Bulbs for Soft, Everyday Light", image: CATEGORY_IMAGES.frosted, body: "Pick [frosted LED bulbs](/shop/led-frosted-bulbs) for bedrooms, hallways and landings. A frosted filament LED bulb keeps the vintage shape while softening the glow, and frosted G9 LED bulbs suit smaller fittings." },
      { title: "Smart Home Gadgets for Renovated Homes", image: CATEGORY_IMAGES.smart, body: "Finish a renovation with [smart home gadgets](/shop/smart-gadgets) such as smoke alarms and carbon monoxide detectors. Smart gadgets for home use, including smart kitchen gadgets, are a popular upgrade for homeowners near Leyton." },
      { title: "RGB LED Strip Lights for Creative Spaces", image: CATEGORY_IMAGES.rgb, body: "Add colour to home studios, kids' rooms and kitchen displays with [RGB LED strip lights](/shop/led-rgb-lights). RGB LED lights and light RGB LED options suit Walthamstow's creative workspaces and home projects." },
      { title: "Cool White LED Bulbs for Kitchens and Home Offices", image: CATEGORY_IMAGES.coolWhite, body: "Read a bulb label with confidence: cool white colour temperature sits around 6500K. [Cool white LED bulbs](/shop/cool-white-led-bulbs) give bright, clear light for kitchens, utility rooms and home offices near Leytonstone." },
    ],
    tradeTeamsHeading: "LED Lighting for Waltham Forest Renovators, Trades and Landlords",
    tradeTeams: [
      { title: "Builders and Renovation Contractors", body: "Extensions and loft conversions need lighting you can rely on. Order bulbs and downlights online and keep your next phase moving." },
      { title: "Electricians", body: "Independent electricians near Waltham Forest can rely on a trade account for repeat orders, from downlights to alarms." },
      { title: "Homeowners Upgrading Period Properties", body: "Swap old halogen and incandescent bulbs for LED equivalents. You keep the look of your original fittings and cut energy use." },
      { title: "Landlords and Lettings Agents", body: "Keep rental homes bright and safe with affordable LED bulbs, ceiling lights and alarms." },
      { title: "Cafes, Studios and Independent Shops", body: "Creative businesses near Walthamstow and Leyton benefit from warm, attractive lighting that lasts." },
    ],
    areasWeSupply: [
      { title: "Leyton", body: "Terraced homes and local shops near Leyton need steady lighting upgrades. Filament, candle and GU10 bulbs are the most popular choices." },
      { title: "Walthamstow", body: "From Victorian terraces to modern flats, Walthamstow has a wide range of lighting needs. Browse by fitting type to find the right bulb quickly." },
      { title: "Leytonstone", body: "Renovations and conversions near Leytonstone keep local trades busy. Ceiling lights, downlights and alarms are regular orders." },
    ],
    whyBuy: WHY_BUY_TEMPLATE("Fair pricing for builders, electricians and homeowners. Ask about a trade account for ongoing supply."),
    faqs: [
      { title: "Will LED filament bulbs suit my original period light fittings?", body: "In most cases yes. Check the cap type, such as E27 or E14, and the shape of your shade. Filament styles are made to resemble traditional bulbs." },
      { title: "What size candle bulb do I need for a chandelier?", body: "Many chandeliers use E14 caps, while some older ones use bayonet types. Check the base of your existing bulb before ordering." },
      { title: "Are frosted LED bulbs better than clear?", body: "It depends on the look you want. Frosted bulbs spread light softly and reduce glare, while clear bulbs show off the filament and give a sharper effect." },
      { title: "Do you supply builders near Waltham Forest?", body: "Yes. [Contact us](/contact) to open a trade account for renovation supply." },
      { title: "How do I return an item that does not fit?", body: "You have 14 days to return items. Read our [refund and returns policy](/refund-returns-policy) for the full process." },
    ],
    tradeCtaIntro: "Working on a renovation near Waltham Forest? Our team can help with trade pricing, bulk quantities and repeat supply.",
    nearbyAreas: ["newham", "barking-and-dagenham", "redbridge", "tower-hamlets"],
  },
};

export const areaPageOrder = ["newham", "barking-and-dagenham", "redbridge", "tower-hamlets", "waltham-forest"];
