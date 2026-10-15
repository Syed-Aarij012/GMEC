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

export type AreaRegion = "london" | "essex" | "kent";

export interface AreaPageData {
  slug: string;
  // Which URL section the page lives under; omitted means London.
  region?: AreaRegion;
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

  "bexley": {
    slug: "bexley",
    name: "Bexley and Erith",
    title: "LED Lighting Supplier Near Bexley & Erith | GU10, Ceiling",
    description:
      "LED bulbs, GU10 downlights, ceiling lights and smart gadgets near Bexley and Erith. Trade and retail pricing. Free UK delivery over £100 +VAT.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart home gadgets to builders, electricians, workshops and homeowners near Bexley and Erith. From our East Ham base we help with family-home upgrades, riverside regeneration and the shops and workshops that serve the borough.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat supply on building and maintenance jobs.",
    ],
    heroImage: CATEGORY_IMAGES.ceiling,
    heroAlt: "LED ceiling light fitted in a family home near Bexley and Erith",
    categoriesIntro: "Builders, workshops and homeowners near Bexley and Erith often choose from these categories first.",
    categories: [
      { title: "LED Ceiling Lights for Family Homes and Hallways", image: CATEGORY_IMAGES.ceiling, body: "Refresh hallways, landings and bedrooms with simple [LED ceiling lights](/shop/led-ceiling-lights). Living room ceiling lights and bedroom LED ceiling lights are easy upgrades for family homes near Bexleyheath and Welling." },
      { title: "GU10 Downlights for Kitchens and Refurbishments", image: CATEGORY_IMAGES.gu10, body: "Light kitchens, bathrooms and extensions with reliable [GU10 downlights](/shop/gu10-downlights). A GU10 bathroom downlight suits wet rooms, and fire rated downlights GU10 are popular for refurbishments near Erith and Belvedere." },
      { title: "Cool White LED Bulbs for Workshops and Garages", image: CATEGORY_IMAGES.coolWhite, body: "Looking for bright, clear light? [Cool white LED bulbs](/shop/cool-white-led-bulbs) sit around 6500K, a crisp white that suits workshops, garages and industrial units near Erith and Belvedere." },
      { title: "Smart Home Gadgets for Safer Homes and Rentals", image: CATEGORY_IMAGES.smart, body: "Protect households with [smart home gadgets](/shop/smart-gadgets), such as smoke alarms and carbon monoxide detectors. Smart gadgets for home use are popular with landlords and owners near Welling." },
      { title: "LED Filament Bulbs for Pubs, Cafes and Living Rooms", image: CATEGORY_IMAGES.filament, body: "Bring warmth to pubs, cafes and lounges with [LED filament bulbs](/shop/led-filament-bulbs). An E27 filament bulb or vintage filament bulbs fit many pendants and table lamps near Bexleyheath." },
      { title: "Frosted LED Bulbs for Soft, Even Light", image: CATEGORY_IMAGES.frosted, body: "Pick [frosted LED bulbs](/shop/led-frosted-bulbs) when you want gentle light without glare. Frosted dimmable LED bulbs and frosted G9 LED bulbs suit bedrooms, hallways and compact fittings." },
      { title: "LED Candle Bulbs for Lamps and Wall Lights", image: CATEGORY_IMAGES.candle, body: "Swap tired lamp and wall light bulbs for [LED candle bulbs](/shop/led-candle-bulbs). A dimmable LED candle bulb adds mood to dining rooms, and E14 caps suit many decorative fittings near Bexley." },
      { title: "RGB LED Strip Lights for Bedrooms and Shopfronts", image: CATEGORY_IMAGES.rgb, body: "Add colour behind beds, TVs and shop counters with [RGB LED strip lights](/shop/led-rgb-lights). RGB LED lights suit games rooms and shopfronts near Bexleyheath." },
    ],
    tradeTeamsHeading: "LED Lighting for Bexley and Erith Builders, Workshops and Property Teams",
    tradeTeams: [
      { title: "Builders and Renovation Contractors", body: "Extensions and refurbishments need lighting you can trust. Order downlights and bulbs online and keep your next phase moving." },
      { title: "Electrical Contractors", body: "Independent electricians near Bexleyheath and Welling can use a trade account for repeat orders, from downlights to alarms." },
      { title: "Workshops and Industrial Units", body: "Bright, reliable lighting helps teams work safely near Erith and Belvedere. LED upgrades cut energy costs and replacement visits." },
      { title: "Shops, Pubs and Cafes", body: "Welcoming lighting helps customers stay longer. Choose filament bulbs, downlights and ceiling lights for hospitality and retail." },
      { title: "Landlords and Lettings Agents", body: "Keep rental homes safe and bright with affordable LED bulbs, ceiling lights and alarms for fast turnarounds." },
    ],
    areasWeSupply: [
      { title: "Erith", body: "Riverside regeneration, workshops and family homes mean steady demand for downlights, ceiling lights and practical bulbs." },
      { title: "Belvedere", body: "Homes and light industrial units near Belvedere need dependable bulbs, cool white lighting and alarms." },
      { title: "Bexleyheath", body: "Shops, cafes and family homes near Bexleyheath suit ceiling lights, filament bulbs and everyday replacements." },
      { title: "Welling", body: "Terraced and semi-detached homes near Welling often need quick lighting upgrades and safety devices." },
    ],
    whyBuy: [
      { title: "Trade and Retail Pricing", body: "Fair prices for builders, shops and homeowners. Ask about a trade account for repeat orders." },
      { title: "Free UK Delivery Over £100 +VAT", body: "Add everything you need to one basket and unlock free delivery." },
      { title: "14-Day Returns", body: "Straightforward returns if you order the wrong fitting." },
      { title: "24/7 Support", body: "Helpful support on caps, wattage and colour temperature." },
    ],
    faqs: [
      { title: "Do you supply landlords near Erith?", body: "Yes. We supply landlords, agents and trades with LED bulbs, downlights, ceiling lights and alarms. [Contact us](/contact) to set up a trade account." },
      { title: "Can I buy small quantities of bulbs?", body: "Yes. You can order online as a retail customer, and delivery is free across the UK on orders over £100 +VAT." },
      { title: "Do LED bulbs work with dimmer switches?", body: "Only dimmable LED bulbs work with dimmers, and the dimmer should be compatible. Check the product page for dimming details." },
      { title: "How do I choose LED ceiling lights for a hallway?", body: "Consider the size of the space and the brightness you need, then pick a colour temperature that suits the look. Check the product page for details." },
      { title: "What is your returns policy?", body: "We offer 14-day returns. See our [refund and returns policy](/refund-returns-policy) for details." },
    ],
    tradeCtaIntro: "Starting a job near Bexley or Erith? Speak to our team about trade pricing, bulk orders and repeat supply.",
    nearbyAreas: ["greenwich", "thamesmead", "havering", "newham"],
  },

  "greenwich": {
    slug: "greenwich",
    name: "Greenwich and Woolwich",
    title: "LED Lighting Supplier Near Greenwich & Woolwich | GMEC",
    description:
      "LED downlights, ceiling lights, filament bulbs and smart gadgets near Greenwich and Woolwich for developers and venues. Free UK delivery over £100 +VAT.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart home gadgets to developers, hotels, pubs, electricians and homeowners near Greenwich and Woolwich. From our East Ham base we help with riverside regeneration, new-build schemes and period homes across the borough.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat supply on large projects.",
    ],
    heroImage: CATEGORY_IMAGES.gu10,
    heroAlt: "Electrician fitting GU10 downlights near Greenwich and Woolwich",
    categoriesIntro: "Developers, venues and homeowners near Greenwich and Woolwich often start with these categories.",
    categories: [
      { title: "GU10 Downlights for New-Build Flats and Hotels", image: CATEGORY_IMAGES.gu10, body: "Specify consistent lighting across many units with dependable [GU10 downlights](/shop/gu10-downlights). Fire rated GU10 downlights and a GU10 downlight fitting for each room type keep fit-outs simple near Woolwich." },
      { title: "LED Ceiling Lights for Apartments and Offices", image: CATEGORY_IMAGES.ceiling, body: "Brighten apartments, offices and communal areas with [LED ceiling lights](/shop/led-ceiling-lights). LED ceiling lighting and LED ceiling fixtures give even coverage and fast installs near Woolwich and Charlton." },
      { title: "LED Filament Bulbs for Pubs, Restaurants and Hotels", image: CATEGORY_IMAGES.filament, body: "Create a welcoming glow with [LED filament bulbs](/shop/led-filament-bulbs). Vintage filament bulbs and filament bulb styles suit pubs and restaurants near Greenwich Town, while an E27 filament bulb fits many statement pendants." },
      { title: "Smart Home Gadgets for Developments and Rentals", image: CATEGORY_IMAGES.smart, body: "Equip homes with [smart home gadgets](/shop/smart-gadgets), including smoke alarms and carbon monoxide detectors. Smart gadgets and gadgets for a smart home help managers and landlords near Woolwich and Plumstead." },
      { title: "LED Candle Bulbs for Chandeliers and Hotel Fittings", image: CATEGORY_IMAGES.candle, body: "Keep decorative fittings sparkling with [LED candle bulbs](/shop/led-candle-bulbs). Dimmable LED candle bulbs help hotels and restaurants set the mood, and E14 and B22 options cover many chandeliers and wall lights near Greenwich Town." },
      { title: "Frosted LED Bulbs for Guest Rooms and Bedrooms", image: CATEGORY_IMAGES.frosted, body: "Soften the light in guest rooms and bedrooms with [frosted LED bulbs](/shop/led-frosted-bulbs). Frosted dimmable LED bulbs create a calm atmosphere without harsh glare." },
      { title: "Cool White LED Bulbs for Kitchens and Back-of-House", image: CATEGORY_IMAGES.coolWhite, body: "Choose [cool white LED bulbs](/shop/cool-white-led-bulbs) for kitchens, stock rooms and workspaces. Cool white is a bright, bluish-white light around 6500K, so many managers ask what colour is a cool white bulb before they order." },
      { title: "RGB LED Strip Lights for Venues and Feature Lighting", image: CATEGORY_IMAGES.rgb, body: "Add colour to bar backs, shelves and display areas with [RGB LED strip lights](/shop/led-rgb-lights). Choose RGB LED lights or 12V RGB LED strip lights for feature lighting near Charlton and Woolwich." },
    ],
    tradeTeamsHeading: "LED Lighting for Greenwich and Woolwich Developers, Venues and Trades",
    tradeTeams: [
      { title: "Property Developers", body: "Regeneration and new-build schemes near Woolwich need repeatable lighting across many homes. Talk to us about bulk quantities for your next phase." },
      { title: "Electrical Contractors", body: "Keep jobs moving with one supplier for downlights, bulbs and alarms. Trade accounts make repeat orders simple near Woolwich, Plumstead and Charlton." },
      { title: "Hotels, Pubs and Restaurants", body: "Venues near Greenwich Town need warm, dependable lighting that lasts. Our LED range helps cut replacement time and running costs." },
      { title: "Landlords and Property Managers", body: "Blocks and rental homes need regular bulb changes and safety upgrades. Order bulbs, fittings and alarms in volume for maintenance runs." },
      { title: "Homeowners Upgrading Period Homes", body: "Swap old bulbs for LED equivalents and keep the character of your original fittings while cutting energy use." },
    ],
    areasWeSupply: [
      { title: "Woolwich", body: "Riverside regeneration and new homes mean ongoing fit-outs near Woolwich. Contractors can order downlights and ceiling lights for repeat phases." },
      { title: "Plumstead", body: "Terraced homes and local businesses near Plumstead need steady bulb replacements and fitting upgrades." },
      { title: "Charlton", body: "A mix of flats, houses and local businesses near Charlton keeps demand steady for everyday lighting." },
      { title: "Greenwich Town", body: "Hotels, pubs, restaurants and period homes near Greenwich Town suit decorative bulbs and warm, dependable lighting." },
    ],
    whyBuy: [
      { title: "Trade and Retail Pricing", body: "Competitive pricing for developers, venues and homeowners. Ask about trade accounts for repeat supply." },
      { title: "Free UK Delivery Over £100 +VAT", body: "Combine items in one order to qualify for free delivery on larger jobs." },
      { title: "14-Day Returns", body: "Simple returns give you confidence when ordering for several units." },
      { title: "24/7 Support", body: "Real people on hand for questions about fittings, wattage and colour temperature." },
    ],
    faqs: [
      { title: "Do you supply developers near Woolwich?", body: "Yes. We support developers, contractors and property teams. [Contact us](/contact) to discuss bulk pricing and phased deliveries." },
      { title: "Do LED bulbs save energy compared with old bulbs?", body: "LED bulbs use less energy than traditional incandescent bulbs and usually last longer, which helps cut running and replacement costs." },
      { title: "Which bulb do I need for a pub or restaurant pendant?", body: "Check the cap type, often E27 or E14. Filament styles look best in exposed pendants, while frosted bulbs give a softer glow." },
      { title: "Can I order for several apartments at once?", body: "Yes. [Contact our team](/contact) to plan quantities and repeat supply for multi-unit projects." },
      { title: "How do I return an item that does not suit?", body: "You have 14 days to return items. Read our [refund and returns policy](/refund-returns-policy) for the full process." },
    ],
    tradeCtaIntro: "Working on a development or venue near Greenwich or Woolwich? Our team can help with trade pricing, bulk quantities and repeat supply.",
    nearbyAreas: ["thamesmead", "bexley", "newham", "tower-hamlets"],
  },

  "hackney": {
    slug: "hackney",
    name: "Hackney",
    title: "LED Lighting Supplier Near Hackney | Filament, RGB, GU10",
    description:
      "LED filament bulbs, RGB strip lights, GU10 downlights and ceiling lights near Hackney for cafes, studios and landlords. Free UK delivery over £100 +VAT",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart home gadgets to cafes, studios, landlords and homeowners near Hackney. Our East Ham base keeps us close to the converted warehouses, Victorian terraces and busy high streets that give this part of East London its character.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat purchasing on fit-outs and property maintenance.",
    ],
    heroImage: CATEGORY_IMAGES.filament,
    heroAlt: "Vintage-style LED filament bulb in a pendant light near Hackney",
    categoriesIntro: "Creative businesses, landlords and homeowners near Hackney often start with these categories.",
    categories: [
      { title: "LED Filament Bulbs for Cafes, Bars and Studios", image: CATEGORY_IMAGES.filament, body: "Give exposed pendants and statement fittings a warm, industrial glow with [LED filament bulbs](/shop/led-filament-bulbs). Vintage filament bulbs and an E27 filament bulb are a natural fit for cafes and bars near Hackney Central and Dalston, and they use far less energy than old incandescent lamps." },
      { title: "RGB LED Strip Lights for Studios, Bars and Feature Walls", image: CATEGORY_IMAGES.rgb, body: "Bring colour to music rooms, bars and creative studios near Hackney Wick with [RGB LED strip lights](/shop/led-rgb-lights). Browse RGB LED lights, LED strip RGB lights and 12V RGB LED strip lights for shelving, backlighting and display work." },
      { title: "GU10 Downlights for Conversions and Kitchens", image: CATEGORY_IMAGES.gu10, body: "Light warehouse conversions, flats and kitchens with dependable [GU10 downlights](/shop/gu10-downlights). A fire rated GU10 downlight helps maintain ceiling fire resistance where it matters, and a GU10 bathroom downlight suits wet areas near Stoke Newington and Clapton." },
      { title: "LED Ceiling Lights for Flats and Terraces", image: CATEGORY_IMAGES.ceiling, body: "Replace tired fittings with clean, modern [LED ceiling lights](/shop/led-ceiling-lights). Bedroom LED ceiling lights and living room ceiling lights give even light in Victorian terraces and new flats near Homerton." },
      { title: "LED Candle Bulbs for Wall Lights and Lamps", image: CATEGORY_IMAGES.candle, body: "Keep decorative wall lights and lamps glowing with [LED candle bulbs](/shop/led-candle-bulbs). A dimmable LED candle bulb suits restaurants and living rooms, and candelabra bulbs bring a classic look to period fittings near Dalston." },
      { title: "Smart Home Gadgets for Rental Flats", image: CATEGORY_IMAGES.smart, body: "Help landlords and hosts near Shoreditch keep properties safe with [smart home gadgets](/shop/smart-gadgets) such as smoke alarms and carbon monoxide detectors. Smart gadgets for home use also suit tenants who want a few simple upgrades." },
      { title: "Frosted LED Bulbs for Soft Light in Bedrooms and Studios", image: CATEGORY_IMAGES.frosted, body: "Soften the light in bedrooms, studios and shared spaces with [frosted LED bulbs](/shop/led-frosted-bulbs). A frosted filament LED bulb keeps the vintage look, and comparing clear vs frosted LED bulbs helps you choose between a sharper filament and gentler light." },
      { title: "Cool White LED Bulbs for Workshops and Back Rooms", image: CATEGORY_IMAGES.coolWhite, body: "Choose [cool white LED bulbs](/shop/cool-white-led-bulbs) for workshops, kitchens and back-of-house areas where clear visibility matters. Cool white colour temperature sits around 6500K, a bright white that suits working spaces near Hackney Wick." },
    ],
    tradeTeamsHeading: "LED Lighting for Hackney Trades, Studios and Property Teams",
    tradeTeams: [
      { title: "Electrical Contractors", body: "Keep fit-outs and repairs moving with one supplier for downlights, bulbs and alarms. Trade accounts make repeat orders simple for contractors working near Hackney Central and Dalston." },
      { title: "Landlords and Lettings Agents", body: "Flats and houses near Clapton and Homerton change tenants often, so bulbs, fittings and alarms need regular top-ups. Stock up for void turnarounds and routine maintenance." },
      { title: "Cafes, Bars and Restaurants", body: "Warm, dependable lighting shapes the mood of a venue. Our LED range helps cut replacement time and running costs for hospitality teams near Shoreditch and Stoke Newington." },
      { title: "Studios and Creative Workspaces", body: "Photographers, makers and designers near Hackney Wick need controllable, consistent light. Mix cool white bulbs, ceiling lights and RGB strips to suit each space." },
      { title: "Property Developers", body: "Conversion and new-build schemes near Hackney Wick need consistent lighting across many units. Talk to us about bulk quantities for your next phase." },
    ],
    areasWeSupply: [
      { title: "Hackney Central", body: "A busy hub of shops, flats and offices. Local trades can order bulbs and fittings online for quick turnarounds." },
      { title: "Dalston", body: "Bars, venues and converted buildings keep demand steady for filament bulbs, candle bulbs and downlights." },
      { title: "Stoke Newington", body: "Period terraces and independent shops often need warm, tasteful lighting upgrades." },
      { title: "Clapton", body: "Family homes and rental flats near Clapton call for reliable ceiling lights and everyday bulbs." },
      { title: "Homerton", body: "Flats and terraces near Homerton are a steady source of refurbishment and maintenance work." },
      { title: "Hackney Wick", body: "Studios, warehouses and new developments near Hackney Wick suit RGB strips, cool white bulbs and bulk fit-out supply." },
      { title: "Shoreditch", body: "Offices, bars and short-let flats near Shoreditch need lighting that looks sharp and lasts." },
    ],
    whyBuy: [
      { title: "Trade and Retail Pricing", body: "Fair prices for studios, trades and homeowners. Ask about a trade account for ongoing supply." },
      { title: "Free UK Delivery Over £100 +VAT", body: "Combine your bulbs, strips and fittings into one order to unlock free delivery." },
      { title: "14-Day Returns", body: "If something is not right, our returns process is simple and quick." },
      { title: "24/7 Support", body: "Real people ready to help with caps, wattage and colour temperature." },
    ],
    faqs: [
      { title: "Do you supply cafes, bars and studios near Hackney?", body: "Yes. We supply hospitality and creative businesses as well as electrical trades. [Contact us](/contact) to discuss trade pricing and bulk orders." },
      { title: "What do I need to run 12V RGB LED strip lights?", body: "12V strips need a suitable 12V power supply and controller. Check the product page for what is included, and ask a qualified electrician if you are connecting to the mains." },
      { title: "Which bulb suits an exposed pendant?", body: "Check the cap type first, often E27 or E14. Filament styles look best in bare pendants because the glowing filament is on show." },
      { title: "Can I fit GU10 downlights in a converted flat?", body: "Many conversions use GU10 downlights. Choose fire rated GU10 downlights where ceiling fire protection matters, follow the manufacturer's instructions and use a qualified electrician." },
      { title: "Is delivery free near Hackney?", body: "We deliver across the UK, with free delivery on orders over £100 +VAT." },
    ],
    tradeCtaIntro: "Fitting out a venue or maintaining flats near Hackney? Speak to our team about trade pricing, bulk orders and repeat supply.",
    nearbyAreas: ["tower-hamlets", "waltham-forest", "islington", "newham"],
  },

  "havering": {
    slug: "havering",
    name: "Havering",
    title: "LED Lighting Supplier Near Havering | Ceiling, GU10, Smart",
    description:
      "LED ceiling lights, GU10 downlights, smart gadgets and bulbs near Havering, Romford and Hornchurch. Trade and retail. Free UK delivery over £100 +VAT.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart home gadgets to builders, electricians, shop owners and homeowners near Havering. From our East Ham base we help with the extensions, loft conversions and everyday upgrades that keep family homes around Romford, Hornchurch and Upminster comfortable.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat supply on building and maintenance jobs.",
    ],
    heroImage: CATEGORY_IMAGES.ceiling,
    heroAlt: "LED ceiling light fitted in a family home near Havering",
    categoriesIntro: "Builders, shop owners and homeowners near Havering often reach for these categories first.",
    categories: [
      { title: "LED Ceiling Lights for Bedrooms, Hallways and Living Rooms", image: CATEGORY_IMAGES.ceiling, body: "Update family homes with easy-to-fit [LED ceiling lights](/shop/led-ceiling-lights). Bedroom LED ceiling lights and living room ceiling lights LED options suit 1930s semis and newer builds near Hornchurch and Upminster." },
      { title: "GU10 Downlights for Extensions and Loft Conversions", image: CATEGORY_IMAGES.gu10, body: "Light rear extensions, loft conversions and kitchens with dependable [GU10 downlights](/shop/gu10-downlights). A GU10 downlight is easy to replace, and fire rated GU10 downlights help protect ceilings where loft and floor spaces meet." },
      { title: "Smart Home Gadgets for Family Homes", image: CATEGORY_IMAGES.smart, body: "Add everyday safety and convenience with [smart home gadgets](/shop/smart-gadgets). Smart gadgets for home use, from smoke alarms to carbon monoxide detectors, are popular upgrades for homes near Upminster." },
      { title: "LED Filament Bulbs for Pubs, Restaurants and Lounges", image: CATEGORY_IMAGES.filament, body: "Add warmth to pubs, restaurants and living rooms with [LED filament bulbs](/shop/led-filament-bulbs). An E27 filament bulb fits many pendants, and filament light bulbs keep running costs down for venues near Romford." },
      { title: "Frosted LED Bulbs for Comfortable Everyday Rooms", image: CATEGORY_IMAGES.frosted, body: "Choose [frosted LED bulbs](/shop/led-frosted-bulbs) for bedrooms, landings and children's rooms where glare should stay low. A frosted filament LED bulb keeps the vintage shape with a softer glow." },
      { title: "Cool White LED Bulbs for Garages, Shops and Utility Rooms", image: CATEGORY_IMAGES.coolWhite, body: "Wondering what colour is a cool white LED? [Cool white LED bulbs](/shop/cool-white-led-bulbs) give a bright white around 6500K, ideal for garages, shop floors and utility rooms near Romford." },
      { title: "LED Candle Bulbs for Lamps and Wall Lights", image: CATEGORY_IMAGES.candle, body: "Replace old lamp and wall light bulbs with [LED candle bulbs](/shop/led-candle-bulbs). A candle LED bulb in a screw or bayonet cap suits dining rooms, and a B22 bulb covers many bayonet fittings in older homes near Hornchurch." },
      { title: "RGB LED Strip Lights for Bedrooms and Games Rooms", image: CATEGORY_IMAGES.rgb, body: "Add playful colour behind TVs, desks and shelves with [RGB LED strip lights](/shop/led-rgb-lights). LED strip RGB lights and 12V RGB LED strip lights make a simple upgrade for teen rooms and home cinemas." },
    ],
    tradeTeamsHeading: "LED Lighting for Havering Builders, Shops and Property Teams",
    tradeTeams: [
      { title: "Builders and Extension Contractors", body: "Extensions and loft conversions need lighting you can rely on. Order bulbs and downlights online and keep your next phase moving." },
      { title: "Electrical Contractors", body: "Independent electricians near Romford and Hornchurch can use a trade account for repeat orders, from downlights to alarms." },
      { title: "Shops, Salons and Independent Retailers", body: "Bright displays and welcoming interiors help customers stay and buy. LED upgrades cut energy costs and replacement visits." },
      { title: "Landlords and Lettings Agents", body: "Keep rental homes bright and safe with affordable LED bulbs, ceiling lights and alarms for quick turnarounds." },
      { title: "Homeowners Planning Upgrades", body: "Swap old halogen and incandescent bulbs for LED equivalents and enjoy lower running costs room by room." },
    ],
    areasWeSupply: [
      { title: "Romford", body: "A busy town centre with shops, flats and offices, so bulbs, ceiling lights and downlights are in steady demand." },
      { title: "Hornchurch", body: "Family homes and local shops near Hornchurch often need extension lighting and everyday bulb replacements." },
      { title: "Upminster", body: "Larger family homes near Upminster suit ceiling lights, downlights and smart safety upgrades." },
    ],
    whyBuy: [
      { title: "Trade and Retail Pricing", body: "Fair pricing for builders, shops and homeowners. Ask about trade accounts for ongoing supply." },
      { title: "Free UK Delivery Over £100 +VAT", body: "Build one bigger order and unlock free delivery on bulbs and fittings." },
      { title: "14-Day Returns", body: "Easy returns give you peace of mind when choosing fittings for extensions and rooms." },
      { title: "24/7 Support", body: "Help from real people on caps, wattage and colour temperature." },
    ],
    faqs: [
      { title: "Do you supply shops and salons near Romford?", body: "Yes. We supply retail and service businesses as well as trades. [Contact us](/contact) to discuss trade pricing and bulk orders." },
      { title: "How many downlights do I need for a room?", body: "It depends on the size of the room and the brightness of each fitting. A qualified electrician can plan the layout for you." },
      { title: "What is the difference between bayonet and screw bulbs?", body: "Screw caps, such as E14 and E27, twist into the holder. Bayonet caps, such as B22, push in and twist to lock. Check your existing bulb before ordering." },
      { title: "How do I look after smoke alarms?", body: "Follow the manufacturer's instructions and your local fire service guidance on testing and replacement." },
      { title: "Is there a minimum order for trade customers?", body: "[Contact our team](/contact) to discuss quantities, pricing and repeat supply for your business." },
    ],
    tradeCtaIntro: "Working on an extension or upgrade near Havering? Speak to our team about trade pricing, bulk orders and repeat supply.",
    nearbyAreas: ["barking-and-dagenham", "redbridge", "newham", "bexley"],
  },

  "islington": {
    slug: "islington",
    name: "Islington",
    title: "LED Lighting Supplier Near Islington | Candle, Ceiling, GU10",
    description:
      "LED candle bulbs, ceiling lights, GU10 downlights and smart gadgets near Islington for period homes and venues. Free UK delivery over £100 +VAT.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart home gadgets to homeowners, landlords, restaurants and offices near Islington. From our East Ham base we help with Georgian and Victorian homes, converted warehouses and busy commercial streets across the borough.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat supply on renovations and fit-outs.",
    ],
    heroImage: CATEGORY_IMAGES.candle,
    heroAlt: "LED candle bulbs in a period chandelier near Islington",
    categoriesIntro: "Homeowners, restaurants and offices near Islington often choose from these categories first.",
    categories: [
      { title: "LED Candle Bulbs for Chandeliers and Period Fittings", image: CATEGORY_IMAGES.candle, body: "Show off original chandeliers and wall lights with [LED candle bulbs](/shop/led-candle-bulbs). A dimmable LED candle bulb suits dining rooms and hallways, and candelabra bulbs keep that traditional look near Highbury and Barnsbury." },
      { title: "LED Ceiling Lights for Bedrooms and Living Rooms", image: CATEGORY_IMAGES.ceiling, body: "Refresh period rooms with clean, modern [LED ceiling lights](/shop/led-ceiling-lights). Choose bedroom LED ceiling lights for a calm feel, or LED ceiling fixtures for larger living spaces near Holloway and Archway." },
      { title: "GU10 Downlights for Kitchens, Hallways and Extensions", image: CATEGORY_IMAGES.gu10, body: "Light kitchens, hallways and rear extensions with reliable [GU10 downlights](/shop/gu10-downlights). A GU10 downlight fitting is quick to swap, and fire rated downlights GU10 help protect ceilings in flats and conversions near the Angel." },
      { title: "LED Filament Bulbs for Restaurants and Pendants", image: CATEGORY_IMAGES.filament, body: "Create a warm welcome with [LED filament bulbs](/shop/led-filament-bulbs). Filament light bulbs and vintage filament bulbs suit restaurants and wine bars along busy streets near the Angel, while an E27 filament bulb fits many pendant lights." },
      { title: "Smart Home Gadgets for Safer Homes and Rentals", image: CATEGORY_IMAGES.smart, body: "Add useful safety to flats and terraces with [smart home gadgets](/shop/smart-gadgets), including smoke alarms and carbon monoxide detectors. Gadgets for a smart home are popular with landlords and owners near Holloway." },
      { title: "Frosted LED Bulbs for Gentle, Even Light", image: CATEGORY_IMAGES.frosted, body: "Reduce glare in bedrooms and offices with [frosted LED bulbs](/shop/led-frosted-bulbs). A frost LED bulb spreads light softly, and frosted dimmable LED bulbs add control where a dimmer is fitted." },
      { title: "Cool White LED Bulbs for Offices and Studios", image: CATEGORY_IMAGES.coolWhite, body: "Understand the cool white colour temperature before you buy. [Cool white LED bulbs](/shop/cool-white-led-bulbs) give a bright, daylight-style light around 6500K, a good fit for design studios and offices near Clerkenwell." },
      { title: "RGB LED Strip Lights for Venues and Display Lighting", image: CATEGORY_IMAGES.rgb, body: "Add colour to bar fronts, shelving and retail displays with [RGB LED strip lights](/shop/led-rgb-lights). Light RGB LED options and led lights strips RGB bring flexible accent lighting to venues near the Angel." },
    ],
    tradeTeamsHeading: "LED Lighting for Islington Homes, Venues and Property Teams",
    tradeTeams: [
      { title: "Homeowners Renovating Period Properties", body: "Georgian and Victorian homes deserve lighting that respects their character. Swap old bulbs for LED equivalents and keep the look of your original fittings." },
      { title: "Electrical Contractors", body: "One supplier for downlights, bulbs and alarms keeps jobs on schedule. Trade accounts make repeat orders simple for contractors working near the Angel and Highbury." },
      { title: "Restaurants, Bars and Hotels", body: "Hospitality teams near Upper Street and Clerkenwell need warm, dependable lighting that lasts. Our LED range cuts replacement time and running costs." },
      { title: "Offices and Design Studios", body: "Even, glare-free lighting supports focused work. Pair ceiling lights with cool white bulbs for comfortable workspaces near Clerkenwell." },
      { title: "Landlords and Lettings Agents", body: "Flats near Holloway and Archway need regular bulb replacements and safety upgrades. Stock up on bulbs, fittings and alarms for void turnarounds." },
    ],
    areasWeSupply: [
      { title: "Angel", body: "Restaurants, bars, shops and offices cluster near the Angel, so decorative bulbs and ceiling lights are always in demand." },
      { title: "Clerkenwell", body: "Converted warehouses, design studios and offices near Clerkenwell suit cool white bulbs, downlights and ceiling lights." },
      { title: "Highbury", body: "Period terraces and family homes near Highbury often need candle bulbs, filament bulbs and ceiling light upgrades." },
      { title: "Holloway", body: "Flats and rental homes near Holloway call for dependable bulbs, alarms and everyday fittings." },
      { title: "Archway", body: "A mix of flats, houses and local businesses near Archway means steady demand for downlights and smart gadgets." },
    ],
    whyBuy: [
      { title: "Trade and Retail Pricing", body: "Honest prices for homeowners, venues and trades. Ask about a trade account for repeat supply." },
      { title: "Free UK Delivery Over £100 +VAT", body: "Gather all your bulbs and fittings in one basket to qualify for free delivery." },
      { title: "14-Day Returns", body: "A straightforward returns process if a fitting turns out not to suit." },
      { title: "24/7 Support", body: "Friendly help choosing caps, wattage and colour temperature." },
    ],
    faqs: [
      { title: "Do you supply restaurants and offices near Islington?", body: "Yes. We supply hospitality, office and retail customers as well as trades. [Contact us](/contact) to talk through trade pricing and bulk orders." },
      { title: "What colour LED ceiling light suits a bedroom?", body: "Warm white is a popular choice for bedrooms because it gives a cosy light, while cool white suits kitchens and offices. Check the colour temperature on the product page." },
      { title: "Are LED candle bulbs bright enough for a dining room?", body: "Compare the brightness, shown in lumens, on each product page. Using several dimmable LED candle bulbs in a chandelier lets you adjust the mood." },
      { title: "What counts as a smart gadget for the home?", body: "Smart home gadgets include smoke alarms, carbon monoxide alarms and other devices that make a home safer or easier to manage. Browse the range to see what is available." },
      { title: "Can letting agents open a trade account near Islington?", body: "Yes. [Contact our team](/contact) to discuss quantities, pricing and repeat supply for your portfolio." },
    ],
    tradeCtaIntro: "Planning a renovation or fit-out near Islington? Our team can help with trade pricing, bulk quantities and repeat supply.",
    nearbyAreas: ["hackney", "tower-hamlets", "waltham-forest", "newham"],
  },

  "thamesmead": {
    slug: "thamesmead",
    name: "Thamesmead",
    title: "LED Lighting Supplier Near Thamesmead | Trade & Retail",
    description:
      "LED bulbs, GU10 downlights, ceiling lights and alarms near Thamesmead for housing teams and trades. Free UK delivery over £100 +VAT.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart home gadgets to housing teams, contractors, community buildings and homeowners near Thamesmead. From our East Ham base we support the maintenance, regeneration and new-home work that continues across the area.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat supply on maintenance programmes.",
    ],
    heroImage: CATEGORY_IMAGES.gu10,
    heroAlt: "Electrician fitting GU10 downlights near Thamesmead",
    categoriesIntro: "Housing teams, contractors and homeowners near Thamesmead often start with these categories.",
    categories: [
      { title: "GU10 Downlights for Maintenance and Refurbishment", image: CATEGORY_IMAGES.gu10, body: "Keep repair schedules on track with dependable [GU10 downlights](/shop/gu10-downlights). Fire rated GU10 downlights are available for ceilings that need protection, and a GU10 downlight fitting suits quick, repeatable installs near Thamesmead Town Centre." },
      { title: "LED Ceiling Lights for New Homes and Communal Areas", image: CATEGORY_IMAGES.ceiling, body: "Fit out new homes and communal spaces with [LED ceiling lights](/shop/led-ceiling-lights). LED ceiling fixtures and ceiling lights LED options give even coverage and fast installs near West Thamesmead." },
      { title: "Smart Home Gadgets for Safer Housing", image: CATEGORY_IMAGES.smart, body: "Protect residents with [smart home gadgets](/shop/smart-gadgets), including smoke alarms and carbon monoxide detectors. Smart gadgets for home use support safety checks across managed properties near Abbey Wood." },
      { title: "Cool White LED Bulbs for Stairwells and Corridors", image: CATEGORY_IMAGES.coolWhite, body: "Understand the cool white colour temperature before you order. [Cool white LED bulbs](/shop/cool-white-led-bulbs) sit around 6500K and look bright and bluish-white, which suits stairwells, corridors and utility rooms." },
      { title: "Frosted LED Bulbs for Comfortable Shared Spaces", image: CATEGORY_IMAGES.frosted, body: "Choose [frosted LED bulbs](/shop/led-frosted-bulbs) when light should be even and glare-free. A frost LED bulb works well in hallways and communal rooms, and frosted dimmable LED bulbs add control where needed." },
      { title: "LED Filament Bulbs for Cafes and Community Venues", image: CATEGORY_IMAGES.filament, body: "Bring a warm, friendly feel to cafes and community venues with [LED filament bulbs](/shop/led-filament-bulbs). Filament light bulbs in E27 and E14 sizes replace old incandescent lamps and last far longer." },
      { title: "LED Candle Bulbs for Lamps and Decorative Fittings", image: CATEGORY_IMAGES.candle, body: "Refresh lamps and wall lights with [LED candle bulbs](/shop/led-candle-bulbs). A candle LED bulb in E14 suits many decorative fittings, and a B22 bulb covers common bayonet fittings." },
      { title: "RGB LED Strip Lights for Bedrooms and Youth Spaces", image: CATEGORY_IMAGES.rgb, body: "Create colourful, fun lighting behind TVs, beds and shelving with [RGB LED strip lights](/shop/led-rgb-lights). LED strip RGB lights are a low-cost upgrade for bedrooms and youth spaces near Thamesmead." },
    ],
    tradeTeamsHeading: "LED Lighting for Thamesmead Housing Teams, Trades and Community Buildings",
    tradeTeams: [
      { title: "Housing Teams and Maintenance Crews", body: "Repair and void teams need predictable stock. Order bulbs, downlights and alarms in volume and keep vans ready for jobs near Thamesmead." },
      { title: "Electrical Contractors", body: "Rewires, upgrades and repairs all need dependable parts. A trade account gives contractors one supplier for lighting, fittings and safety devices." },
      { title: "Property Developers", body: "New homes and regeneration schemes near Thamesmead need consistent lighting across many units. Contact us to plan volumes and repeat supply." },
      { title: "Schools and Community Buildings", body: "Halls, classrooms and corridors use a lot of lighting. LED upgrades cut running costs and reduce replacement visits." },
      { title: "Landlords and Homeowners", body: "Keep homes bright and safe with affordable LED replacements, ceiling lights and alarms." },
    ],
    areasWeSupply: [
      { title: "Thamesmead Town Centre", body: "Shops, services and community buildings near the town centre need dependable bulbs, ceiling lights and downlights." },
      { title: "West Thamesmead", body: "Homes and estates near West Thamesmead call for regular lighting upkeep and safety upgrades." },
      { title: "Abbey Wood", body: "Flats and houses near Abbey Wood create steady demand for downlights, ceiling lights and alarms." },
    ],
    whyBuy: [
      { title: "Trade and Retail Pricing", body: "Fair pricing for housing teams, contractors and homeowners. Ask about trade accounts for ongoing supply." },
      { title: "Free UK Delivery Over £100 +VAT", body: "Combine bulbs, fittings and alarms in one order to qualify for free delivery." },
      { title: "14-Day Returns", body: "A simple returns process gives you confidence when ordering in quantity." },
      { title: "24/7 Support", body: "Help from real people on fittings, wattage and colour temperature." },
    ],
    faqs: [
      { title: "Can housing teams order repeat supplies near Thamesmead?", body: "Yes. We support housing teams, contractors and developers. [Contact our team](/contact) to discuss bulk pricing and repeat orders." },
      { title: "Which colour temperature suits stairwells and communal areas?", body: "Many stairwells and corridors use cool white light, around 6500K, for clear visibility. Check what suits your building before ordering." },
      { title: "Do you sell fire rated GU10 downlights?", body: "Yes. Fire rated GU10 downlights are designed to help maintain a ceiling's fire resistance. Follow the manufacturer's instructions and use a qualified electrician." },
      { title: "Can I get bulk pricing on bulbs and alarms?", body: "[Contact our team](/contact) to discuss quantities, pricing and repeat supply for your organisation." },
      { title: "Is delivery free near Thamesmead?", body: "We deliver across the UK, with free delivery on orders over £100 +VAT." },
    ],
    tradeCtaIntro: "Planning maintenance or a new-home fit-out near Thamesmead? Our team can help with trade pricing, bulk quantities and repeat supply.",
    nearbyAreas: ["greenwich", "bexley", "barking-and-dagenham", "newham"],
  },

  "chigwell": {
    slug: "chigwell",
    region: "essex",
    name: "Chigwell",
    title: "LED Lighting Supplier Near Chigwell | Ceiling, GU10, Smart",
    description:
      "LED ceiling lights, GU10 downlights, smart gadgets and decorative bulbs near Chigwell for renovations and larger homes. Free UK delivery over £100 +VAT.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart home gadgets to homeowners, builders and electricians near Chigwell. From our East Ham base we help with the renovations, extensions and kitchen upgrades that larger family homes across the Essex border often need.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat supply on building and fit-out jobs.",
    ],
    heroImage: CATEGORY_IMAGES.ceiling,
    heroAlt: "LED ceiling light fitted in a family home near Chigwell",
    categoriesIntro: "Homeowners, builders and electricians near Chigwell often start with these categories.",
    categories: [
      { title: "LED Ceiling Lights for Large Hallways and Bedrooms", image: CATEGORY_IMAGES.ceiling, body: "Light generous hallways, landings and bedrooms with [LED ceiling lights](/shop/led-ceiling-lights). LED ceiling fixtures and LED ceiling lighting give even coverage for larger rooms near Chigwell and Grange Hill." },
      { title: "GU10 Downlights for Kitchens, Extensions and Home Offices", image: CATEGORY_IMAGES.gu10, body: "Create layered light in open-plan kitchens, extensions and home offices with [GU10 downlights](/shop/gu10-downlights). A GU10 downlight is easy to replace, and a GU10 bathroom downlight suits en-suites near Buckhurst Hill." },
      { title: "LED Candle Bulbs for Chandeliers and Statement Fittings", image: CATEGORY_IMAGES.candle, body: "Keep grand chandeliers and wall lights sparkling with [LED candle bulbs](/shop/led-candle-bulbs). Dimmable LED candle bulbs and candelabra bulbs suit formal dining rooms near Chigwell Row, with E14 and B22 options for different fittings." },
      { title: "Smart Home Gadgets for Larger Homes", image: CATEGORY_IMAGES.smart, body: "Add peace of mind to bigger properties with [smart home gadgets](/shop/smart-gadgets), from smoke alarms to carbon monoxide detectors. Gadgets for a smart home help owners keep on top of safety across several floors." },
      { title: "LED Filament Bulbs for Pendants and Kitchen Islands", image: CATEGORY_IMAGES.filament, body: "Hang decorative pendants over kitchen islands with [LED filament bulbs](/shop/led-filament-bulbs). Vintage filament bulbs and an E27 filament bulb give a warm, stylish glow with lower running costs." },
      { title: "Frosted LED Bulbs for Bedrooms and Landings", image: CATEGORY_IMAGES.frosted, body: "Soften the light on landings and in bedrooms with [frosted LED bulbs](/shop/led-frosted-bulbs). Frosted dimmable LED bulbs give smooth, comfortable light where a dimmer is fitted." },
      { title: "Cool White LED Bulbs for Garages and Utility Rooms", image: CATEGORY_IMAGES.coolWhite, body: "Wondering what colour is a cool white bulb? [Cool white LED bulbs](/shop/cool-white-led-bulbs) give a crisp, daylight-style white around 6500K, ideal for garages, utility rooms and home workshops near Chigwell." },
      { title: "RGB LED Strip Lights for Home Cinemas and Games Rooms", image: CATEGORY_IMAGES.rgb, body: "Add colour behind TVs and shelving in home cinemas and games rooms with [RGB LED strip lights](/shop/led-rgb-lights). RGB LED lights and 12V RGB LED strip lights bring flexible accent lighting." },
    ],
    tradeTeamsHeading: "LED Lighting for Chigwell Homes, Builders and Property Teams",
    tradeTeams: [
      { title: "Homeowners Planning Renovations", body: "Extensions, loft conversions and kitchen refits all need the right lighting plan. Swap old halogen and incandescent bulbs for LED and cut running costs room by room." },
      { title: "Builders and Extension Contractors", body: "Keep projects on schedule by ordering downlights, ceiling lights and bulbs online. Trade accounts make repeat orders simple for jobs near Chigwell and Buckhurst Hill." },
      { title: "Electrical Contractors", body: "One supplier for downlights, bulbs and alarms saves time on site. Ask about a trade account for repeat supply." },
      { title: "Landlords and Lettings Agents", body: "Keep rental homes bright and safe with affordable LED bulbs, ceiling lights and alarms for quick turnarounds." },
      { title: "Offices and Small Businesses", body: "Bright, even lighting keeps workspaces comfortable. Explore ceiling lights and cool white bulbs for small commercial fit-outs." },
    ],
    areasWeSupply: [
      { title: "Chigwell", body: "Larger family homes and local shops near Chigwell call for dependable ceiling lights, downlights and decorative bulbs." },
      { title: "Grange Hill", body: "Homes and local businesses near Grange Hill need steady bulb replacements and fitting upgrades." },
      { title: "Chigwell Row", body: "Detached homes near Chigwell Row often need chandelier bulbs, pendants and outdoor-style upgrades handled by a qualified electrician." },
      { title: "Buckhurst Hill", body: "Renovation and extension work near Buckhurst Hill creates regular demand for downlights and kitchen lighting." },
    ],
    whyBuy: [
      { title: "Trade and Retail Pricing", body: "Fair pricing for homeowners, builders and electricians. Ask about a trade account for ongoing supply." },
      { title: "Free UK Delivery Over £100 +VAT", body: "Plan your whole project in one basket and unlock free delivery." },
      { title: "14-Day Returns", body: "Easy returns give you confidence when choosing finishes and fittings." },
      { title: "24/7 Support", body: "Friendly help on caps, wattage and colour temperature." },
    ],
    faqs: [
      { title: "Do you supply builders and electricians near Chigwell?", body: "Yes. We supply builders, electricians and property teams. [Contact us](/contact) to open a trade account for repeat supply." },
      { title: "How many bulbs does a large chandelier need?", body: "It depends on the fitting. Count the sockets in your chandelier and check the cap type, such as E14 or B22, before ordering." },
      { title: "Which downlights suit a kitchen extension?", body: "Choose GU10 downlights spaced to give even light across the room, and consider fire rated versions where ceiling protection matters. A qualified electrician can plan the layout." },
      { title: "Can I use smart gadgets across a large house?", body: "Yes. Smart home gadgets such as smoke alarms and carbon monoxide detectors can be placed across several floors. Follow the manufacturer's instructions." },
      { title: "Is delivery free near Chigwell?", body: "We deliver across the UK, with free delivery on orders over £100 +VAT." },
    ],
    tradeCtaIntro: "Planning a renovation or extension near Chigwell? Speak to our team about trade pricing, bulk orders and repeat supply.",
    nearbyAreas: ["redbridge", "waltham-forest", "havering", "brentwood"],
  },

  "brentwood": {
    slug: "brentwood",
    region: "essex",
    name: "Brentwood",
    title: "LED Lighting Supplier Near Brentwood | Filament, Candle",
    description:
      "LED filament bulbs, candle bulbs, GU10 downlights and ceiling lights near Brentwood for restaurants, shops and homes. Free UK delivery over £100 +VAT.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart home gadgets to restaurants, shops, builders, electricians and homeowners near Brentwood. From our East Ham base, we help with the high street venues, period cottages and new-build homes found around Brentwood, Shenfield and Warley.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat supply on fit-outs and renovations.",
    ],
    heroImage: CATEGORY_IMAGES.filament,
    heroAlt: "Vintage-style LED filament bulb in a pendant light near Brentwood",
    categoriesIntro: "Venues, shops and homeowners near Brentwood often choose from these categories first.",
    categories: [
      { title: "LED Filament Bulbs for Restaurants, Bars and Pubs", image: CATEGORY_IMAGES.filament, body: "Give dining rooms and bars a warm, inviting glow with [LED filament bulbs](/shop/led-filament-bulbs). Filament light bulbs and vintage filament bulbs suit exposed pendants near Brentwood High Street, while an E27 filament bulb fits many statement fittings." },
      { title: "LED Candle Bulbs for Period Cottages and Wall Lights", image: CATEGORY_IMAGES.candle, body: "Keep wall lights and lamps in period homes working beautifully with [LED candle bulbs](/shop/led-candle-bulbs). A dimmable LED candle bulb and candelabra bulbs suit cottages near Hutton and Warley, and a B22 bulb covers bayonet fittings." },
      { title: "GU10 Downlights for Shops, Salons and Kitchens", image: CATEGORY_IMAGES.gu10, body: "Brighten shop floors, salons and kitchens with dependable [GU10 downlights](/shop/gu10-downlights). A GU10 downlight fitting is quick to replace, and fire rated GU10 downlights are popular for ceilings that need protection." },
      { title: "LED Ceiling Lights for New-Build Homes and Offices", image: CATEGORY_IMAGES.ceiling, body: "Light new homes and small offices near Shenfield with [LED ceiling lights](/shop/led-ceiling-lights). Bedroom LED ceiling lights and living room ceiling lights LED options are simple to fit and easy to repeat across several units." },
      { title: "Smart Home Gadgets for Safer Homes and Rentals", image: CATEGORY_IMAGES.smart, body: "Equip homes with [smart home gadgets](/shop/smart-gadgets), including smoke alarms and carbon monoxide detectors. Smart gadgets for home use suit landlords and owners near Brentwood who want simple safety upgrades." },
      { title: "Frosted LED Bulbs for Gentle, Glare-Free Light", image: CATEGORY_IMAGES.frosted, body: "Choose [frosted LED bulbs](/shop/led-frosted-bulbs) for bedrooms, landings and treatment rooms. A frosted filament LED bulb keeps the vintage shape while softening the glow." },
      { title: "Cool White LED Bulbs for Kitchens and Back Offices", image: CATEGORY_IMAGES.coolWhite, body: "Choose [cool white LED bulbs](/shop/cool-white-led-bulbs) for kitchens, stock rooms and back offices. The cool white colour temperature sits around 6500K, a bright, clean white that makes tasks easier." },
      { title: "RGB LED Strip Lights for Shop Displays and Bedrooms", image: CATEGORY_IMAGES.rgb, body: "Add accent colour to shop displays, bar shelves and bedrooms with [RGB LED strip lights](/shop/led-rgb-lights). LED strip RGB lights bring simple, flexible effects near Brentwood town centre." },
    ],
    tradeTeamsHeading: "LED Lighting for Brentwood Venues, Builders and Property Teams",
    tradeTeams: [
      { title: "Restaurants, Bars and Hotels", body: "Hospitality teams near Brentwood and Shenfield need warm, dependable lighting that lasts. Our LED range helps cut replacement time and running costs." },
      { title: "Shops and Salons", body: "Bright, welcoming interiors help customers feel comfortable. Choose downlights and ceiling lights that suit your layout." },
      { title: "Electrical Contractors", body: "Independent electricians near Brentwood can use a trade account for repeat orders, from downlights to alarms." },
      { title: "Builders and Developers", body: "New-build and conversion work near Warley and Hutton needs consistent lighting across units. Talk to us about bulk quantities." },
      { title: "Homeowners and Landlords", body: "Swap old bulbs for LED equivalents and keep the character of your fittings while cutting energy use." },
    ],
    areasWeSupply: [
      { title: "Brentwood", body: "A busy high street and town centre mean steady demand for decorative bulbs, downlights and everyday replacements." },
      { title: "Shenfield", body: "Commuter homes and local shops near Shenfield suit ceiling lights, downlights and safety upgrades." },
      { title: "Warley", body: "Family homes near Warley often need extension lighting and bulb replacements." },
      { title: "Hutton", body: "Homes and small businesses near Hutton can order everyday LED lighting online." },
    ],
    whyBuy: [
      { title: "Trade and Retail Pricing", body: "Competitive pricing for venues, shops and homeowners. Ask about a trade account for repeat orders." },
      { title: "Free UK Delivery Over £100 +VAT", body: "Add everything you need to one basket and unlock free delivery." },
      { title: "14-Day Returns", body: "Simple returns if something does not suit your fitting or space." },
      { title: "24/7 Support", body: "Real people ready to help with caps, wattage and colour temperature." },
    ],
    faqs: [
      { title: "Do you supply restaurants and shops near Brentwood?", body: "Yes. We supply hospitality and retail customers as well as trades. [Contact us](/contact) to discuss trade pricing and bulk orders." },
      { title: "Are filament bulbs suitable for pubs and restaurants?", body: "Yes. Filament styles give a warm, decorative glow while using less energy than traditional bulbs. Check the cap type and whether a dimmer is fitted." },
      { title: "Which colour temperature suits a shop or salon?", body: "Warm white feels welcoming, while cool white gives a bright, clean look. Check the colour temperature on each product page and test before fitting a whole space." },
      { title: "Can builders open a trade account near Brentwood?", body: "Yes. [Contact our team](/contact) to discuss quantities, pricing and repeat supply." },
      { title: "Is delivery free near Brentwood?", body: "We deliver across the UK, with free delivery on orders over £100 +VAT." },
    ],
    tradeCtaIntro: "Fitting out a venue or renovating near Brentwood? Our team can help with trade pricing, bulk quantities and repeat supply.",
    nearbyAreas: ["havering", "chigwell", "basildon", "grays"],
  },

  "grays": {
    slug: "grays",
    region: "essex",
    name: "Grays",
    title: "LED Lighting Supplier Near Grays | Cool White, Ceiling, GU10",
    description:
      "Cool white LED bulbs, ceiling lights, GU10 downlights and smart gadgets near Grays and Thurrock for warehouses and homes. Free UK delivery over £100 +VAT.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart home gadgets to facilities managers, contractors, retailers and homeowners near Grays. From our East Ham base we help with the industrial units, logistics sites, retail parks and new-build homes around Grays, Chafford Hundred and West Thurrock.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat supply on maintenance and fit-out work.",
    ],
    heroImage: CATEGORY_IMAGES.coolWhite,
    heroAlt: "LED lighting near Grays",
    categoriesIntro: "Facilities managers, contractors and homeowners near Grays often start with these categories.",
    categories: [
      { title: "Cool White LED Bulbs for Warehouses, Workshops and Garages", image: CATEGORY_IMAGES.coolWhite, body: "Wondering what colour is a cool white LED? [Cool white LED bulbs](/shop/cool-white-led-bulbs) give a bright, bluish-white light around 6500K, a popular choice for workshops, garages and utility spaces near West Thurrock." },
      { title: "LED Ceiling Lights for Offices and Communal Areas", image: CATEGORY_IMAGES.ceiling, body: "Brighten offices, corridors and shared areas with [LED ceiling lights](/shop/led-ceiling-lights). LED ceiling lighting and LED ceiling fixtures give even coverage and fast installs for facilities teams near Grays." },
      { title: "GU10 Downlights for Retail Units and New Homes", image: CATEGORY_IMAGES.gu10, body: "Light shop units, offices and new homes near Chafford Hundred with reliable [GU10 downlights](/shop/gu10-downlights). Fire rated downlights GU10 and a GU10 downlight fitting for each space keep fit-outs simple." },
      { title: "Smart Home Gadgets for Homes and Rentals", image: CATEGORY_IMAGES.smart, body: "Support safety checks with [smart home gadgets](/shop/smart-gadgets), including smoke alarms and carbon monoxide detectors. Smart gadgets and gadgets for a smart home are handy for landlords and owners near Grays." },
      { title: "LED Filament Bulbs for Cafes, Pubs and Living Rooms", image: CATEGORY_IMAGES.filament, body: "Bring warmth to cafes, pubs and lounges with [LED filament bulbs](/shop/led-filament-bulbs). Filament bulb styles and an E27 filament bulb replace old incandescent lamps and last far longer." },
      { title: "Frosted LED Bulbs for Comfortable Everyday Light", image: CATEGORY_IMAGES.frosted, body: "Choose [frosted LED bulbs](/shop/led-frosted-bulbs) for bedrooms, hallways and reception areas. Frosted dimmable LED bulbs spread light softly and reduce glare where a dimmer is fitted." },
      { title: "LED Candle Bulbs for Lamps and Decorative Fittings", image: CATEGORY_IMAGES.candle, body: "Refresh lamps and wall lights with [LED candle bulbs](/shop/led-candle-bulbs). A candle LED bulb in E14 suits many decorative fittings, and dimmable LED bulbs candle styles help set the mood." },
      { title: "RGB LED Strip Lights for Retail Displays and Bedrooms", image: CATEGORY_IMAGES.rgb, body: "Add colour to displays, shelving and bedrooms with [RGB LED strip lights](/shop/led-rgb-lights). RGB LED lights and 12V RGB LED strip lights suit shop fittings and home projects near Lakeside." },
    ],
    tradeTeamsHeading: "LED Lighting for Grays Facilities Teams, Retailers and Contractors",
    tradeTeams: [
      { title: "Warehouse and Facilities Managers", body: "Large sites need dependable, low-maintenance lighting. Plan bulk orders of bulbs and ceiling lights to keep sites bright with fewer replacements." },
      { title: "Electrical Contractors", body: "One supplier for downlights, bulbs and alarms keeps jobs on schedule near Grays and West Thurrock." },
      { title: "Retailers and Leisure Venues", body: "Bright displays and welcoming interiors help customers feel at ease. LED upgrades cut energy costs and replacement visits." },
      { title: "Property Developers", body: "New-build schemes near Chafford Hundred need consistent lighting across many homes. Contact us to plan quantities and repeat supply." },
      { title: "Landlords and Homeowners", body: "Keep homes bright and safe with affordable LED replacements, ceiling lights and alarms." },
    ],
    areasWeSupply: [
      { title: "Grays", body: "A busy town centre with shops, flats and local businesses that use everyday bulbs, ceiling lights and downlights." },
      { title: "Chafford Hundred", body: "New-build family homes near Chafford Hundred need ceiling lights, downlights and safety devices." },
      { title: "West Thurrock", body: "Retail, logistics and commercial sites near West Thurrock suit bulk orders of cool white bulbs and ceiling lights." },
      { title: "Tilbury", body: "Homes, workshops and port-related businesses near Tilbury can order durable LED lighting online." },
    ],
    whyBuy: [
      { title: "Trade and Retail Pricing", body: "Fair pricing for facilities teams, retailers and homeowners. Ask about trade accounts for repeat supply." },
      { title: "Free UK Delivery Over £100 +VAT", body: "Combine items into one order to qualify for free delivery on larger jobs." },
      { title: "14-Day Returns", body: "Straightforward returns give you confidence on bulk orders." },
      { title: "24/7 Support", body: "Help from real people on fittings, wattage and colour temperature." },
    ],
    faqs: [
      { title: "Do you supply commercial and industrial spaces near Grays?", body: "We supply LED bulbs, ceiling lights and downlights for many commercial spaces. [Contact us](/contact) to discuss your requirements and bulk quantities." },
      { title: "What colour temperature suits a workshop or warehouse?", body: "Many workshops use cool white light, around 6500K, because it looks bright and clear. Check what suits your space and the tasks carried out there." },
      { title: "How do I order in bulk near Grays?", body: "[Contact our team](/contact) to discuss quantities, pricing and repeat supply for your site." },
      { title: "Can I return unused bulbs?", body: "Yes. We offer 14-day returns. See our [refund and returns policy](/refund-returns-policy) for details." },
      { title: "Is delivery free near Grays?", body: "We deliver across the UK, with free delivery on orders over £100 +VAT." },
    ],
    tradeCtaIntro: "Managing a site or fit-out near Grays? Speak to our team about trade pricing, bulk orders and repeat supply.",
    nearbyAreas: ["havering", "dartford", "basildon", "barking-and-dagenham"],
  },

  "basildon": {
    slug: "basildon",
    region: "essex",
    name: "Basildon",
    title: "LED Lighting Supplier Near Basildon | GU10, Ceiling, Smart",
    description:
      "GU10 downlights, LED ceiling lights, smart gadgets and bulbs near Basildon, Laindon and Pitsea for housing teams. Free UK delivery over £100 +VAT.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart home gadgets to housing teams, electricians, shop owners and homeowners near Basildon. From our East Ham base, we support the maintenance programmes, industrial estates and family homes found across Basildon, Laindon, Pitsea and Wickford.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat supply on maintenance and building jobs.",
    ],
    heroImage: CATEGORY_IMAGES.gu10,
    heroAlt: "Electrician fitting GU10 downlights near Basildon",
    categoriesIntro: "Housing teams, contractors and homeowners near Basildon often choose from these categories first.",
    categories: [
      { title: "GU10 Downlights for Maintenance and Refurbishment", image: CATEGORY_IMAGES.gu10, body: "Keep repair schedules on track with dependable [GU10 downlights](/shop/gu10-downlights). A GU10 downlight is easy to swap, and fire rated GU10 downlights suit ceilings that need protection near Basildon and Pitsea." },
      { title: "LED Ceiling Lights for Family Homes and Shared Spaces", image: CATEGORY_IMAGES.ceiling, body: "Brighten hallways, bedrooms and shared areas with simple [LED ceiling lights](/shop/led-ceiling-lights). Ceiling lights LED options and LED ceiling fixtures are quick to fit across many homes near Laindon." },
      { title: "Smart Home Gadgets for Safer Housing", image: CATEGORY_IMAGES.smart, body: "Support safety checks with [smart home gadgets](/shop/smart-gadgets), including smoke alarms and carbon monoxide detectors. Smart gadgets for home use suit managed properties and owners near Wickford." },
      { title: "Cool White LED Bulbs for Workshops and Industrial Units", image: CATEGORY_IMAGES.coolWhite, body: "Choose [cool white LED bulbs](/shop/cool-white-led-bulbs) for workshops, stock rooms and units near Basildon's industrial estates. Cool white colour temperature sits around 6500K, a clean, bright white for working spaces." },
      { title: "Frosted LED Bulbs for Comfortable Rooms", image: CATEGORY_IMAGES.frosted, body: "Pick [frosted LED bulbs](/shop/led-frosted-bulbs) for bedrooms, landings and communal rooms. A frost LED bulb softens glare, and frosted dimmable LED bulbs add control where needed." },
      { title: "LED Filament Bulbs for Cafes and Living Rooms", image: CATEGORY_IMAGES.filament, body: "Add a warm glow to cafes and living rooms with [LED filament bulbs](/shop/led-filament-bulbs). Filament light bulbs in E27 and E14 sizes replace old incandescent lamps and run for far longer." },
      { title: "LED Candle Bulbs for Lamps and Wall Lights", image: CATEGORY_IMAGES.candle, body: "Refresh lamps and wall lights with [LED candle bulbs](/shop/led-candle-bulbs). A candle LED bulb in E14 suits many decorative fittings, and a B22 bulb covers common bayonet fittings." },
      { title: "RGB LED Strip Lights for Bedrooms and Leisure Spaces", image: CATEGORY_IMAGES.rgb, body: "Create colourful accent lighting behind TVs, beds and shelving with [RGB LED strip lights](/shop/led-rgb-lights). LED strip RGB lights are a low-cost upgrade for bedrooms and leisure spaces." },
    ],
    tradeTeamsHeading: "LED Lighting for Basildon Housing Teams, Trades and Businesses",
    tradeTeams: [
      { title: "Housing Teams and Maintenance Crews", body: "Repair and void teams need predictable stock. Order bulbs, downlights and alarms in volume and keep vans ready for jobs near Basildon." },
      { title: "Electrical Contractors", body: "Rewires, upgrades and repairs all need dependable parts. A trade account gives contractors one supplier for lighting and safety devices." },
      { title: "Industrial Units and Workshops", body: "Reliable lighting helps teams work safely. LED upgrades cut energy costs and reduce replacement visits." },
      { title: "Shops, Cafes and Leisure Venues", body: "Welcoming lighting supports a good customer experience. Choose downlights, ceiling lights and decorative bulbs to suit your space." },
      { title: "Landlords and Homeowners", body: "Keep homes bright and safe with affordable LED replacements, ceiling lights and alarms." },
    ],
    areasWeSupply: [
      { title: "Basildon Town Centre", body: "Shops, offices and flats near the town centre need dependable bulbs, ceiling lights and downlights." },
      { title: "Laindon", body: "Family homes near Laindon call for regular lighting upkeep and safety upgrades." },
      { title: "Pitsea", body: "Homes and local businesses near Pitsea can order everyday LED lighting online." },
      { title: "Wickford", body: "Homes and small businesses near Wickford suit ceiling lights, downlights and smart safety devices." },
    ],
    whyBuy: [
      { title: "Trade and Retail Pricing", body: "Fair pricing for housing teams, contractors and homeowners. Ask about trade accounts for ongoing supply." },
      { title: "Free UK Delivery Over £100 +VAT", body: "Build a bigger basket and unlock free delivery." },
      { title: "14-Day Returns", body: "Simple returns when ordering in quantity." },
      { title: "24/7 Support", body: "Support from real people on caps, wattage and colour temperature." },
    ],
    faqs: [
      { title: "Can housing teams open a trade account near Basildon?", body: "Yes. We support housing teams, contractors and developers. [Contact our team](/contact) to discuss bulk pricing and repeat orders." },
      { title: "Are GU10 downlights easy to replace?", body: "A GU10 bulb uses a twist-lock cap and is simple to swap. Always turn off the power first, and use a qualified electrician for installation or changes to fittings." },
      { title: "Do you supply schools and community buildings near Basildon?", body: "Yes. LED upgrades can cut running costs and replacement visits. [Contact us](/contact) to discuss quantities and pricing." },
      { title: "How do smart gadgets help with safety checks?", body: "Smoke alarms and carbon monoxide detectors support safety routines in homes and managed properties. Follow the manufacturer's instructions for testing and replacement." },
      { title: "Is delivery free near Basildon?", body: "We deliver across the UK, with free delivery on orders over £100 +VAT." },
    ],
    tradeCtaIntro: "Planning maintenance or a refit near Basildon? Our team can help with trade pricing, bulk quantities and repeat supply.",
    nearbyAreas: ["brentwood", "grays", "havering", "thamesmead"],
  },

  "dartford": {
    slug: "dartford",
    region: "kent",
    name: "Dartford",
    title: "LED Lighting Supplier Near Dartford | RGB, Ceiling, GU10",
    description:
      "LED RGB strip lights, ceiling lights, GU10 downlights and smart gadgets near Dartford for retail, leisure and new homes. Free UK delivery over £100 +VAT.",
    heroIntro: [
      "[GMEC Corporation](/) supplies LED bulbs, downlights, ceiling lights and smart home gadgets to shop owners, leisure venues, builders and homeowners near Dartford. From our East Ham base, we support the retail, workshops and new-build schemes around Dartford, Bluewater and Swanscombe, just across the Kent border.",
      "Order online with free UK delivery on orders over £100 +VAT, or open a trade account for repeat supply on fit-outs and building work.",
    ],
    heroImage: CATEGORY_IMAGES.rgb,
    heroAlt: "LED lighting near Dartford",
    categoriesIntro: "Retailers, leisure venues and homeowners near Dartford often start with these categories.",
    categories: [
      { title: "RGB LED Strip Lights for Retail Displays and Leisure Venues", image: CATEGORY_IMAGES.rgb, body: "Make displays and venues stand out with [RGB LED strip lights](/shop/led-rgb-lights). RGB LED lights, LED strip RGB lights and 12V RGB LED strip lights suit shop shelving, bar backs and entertainment spaces near Bluewater." },
      { title: "LED Ceiling Lights for New Homes and Shops", image: CATEGORY_IMAGES.ceiling, body: "Fit out new homes and shop floors with [LED ceiling lights](/shop/led-ceiling-lights). Bedroom LED ceiling lights and living room ceiling lights give even light and fast installs near Dartford and Stone." },
      { title: "GU10 Downlights for Kitchens, Shops and Extensions", image: CATEGORY_IMAGES.gu10, body: "Light kitchens, shops and extensions with reliable [GU10 downlights](/shop/gu10-downlights). A GU10 downlight fitting is quick to replace, and fire rated GU10 downlights help protect ceilings where needed." },
      { title: "Smart Home Gadgets for Safer Homes", image: CATEGORY_IMAGES.smart, body: "Add everyday safety with [smart home gadgets](/shop/smart-gadgets) such as smoke alarms and carbon monoxide detectors. Smart gadgets for home use suit new-build owners and landlords near Swanscombe." },
      { title: "LED Filament Bulbs for Pubs, Cafes and Restaurants", image: CATEGORY_IMAGES.filament, body: "Bring a warm, decorative glow to pubs, cafes and restaurants with [LED filament bulbs](/shop/led-filament-bulbs). Vintage filament bulbs and an E27 filament bulb fit many pendants near Dartford town centre." },
      { title: "LED Candle Bulbs for Wall Lights and Chandeliers", image: CATEGORY_IMAGES.candle, body: "Swap out old wall light and chandelier bulbs for [LED candle bulbs](/shop/led-candle-bulbs). Dimmable LED candle bulbs set the mood in dining rooms, and E14 caps suit many decorative fittings." },
      { title: "Frosted LED Bulbs for Soft, Even Light", image: CATEGORY_IMAGES.frosted, body: "Pick [frosted LED bulbs](/shop/led-frosted-bulbs) when you want gentle light without glare. Frosted filament LED bulbs keep a vintage look while softening the glow in bedrooms and hallways." },
      { title: "Cool White LED Bulbs for Workshops and Stock Rooms", image: CATEGORY_IMAGES.coolWhite, body: "Looking for bright, clear light? [Cool white LED bulbs](/shop/cool-white-led-bulbs) sit around 6500K, a crisp white that suits workshops, stock rooms and garages near Dartford." },
    ],
    tradeTeamsHeading: "LED Lighting for Dartford Retailers, Builders and Property Teams",
    tradeTeams: [
      { title: "Retailers and Leisure Venues", body: "Bright displays and welcoming interiors help customers stay longer. LED upgrades cut energy costs and replacement visits for venues near Bluewater." },
      { title: "Electrical Contractors", body: "One supplier for downlights, bulbs and alarms keeps jobs moving near Dartford and Stone. Ask about a trade account for repeat orders." },
      { title: "Builders and Developers", body: "New-build schemes near Swanscombe need consistent lighting across many homes. Talk to us about bulk quantities for your next phase." },
      { title: "Workshops and Small Businesses", body: "Reliable lighting helps teams work safely and comfortably. Choose cool white bulbs and ceiling lights to suit your space." },
      { title: "Landlords and Homeowners", body: "Keep homes bright and safe with affordable LED replacements, ceiling lights and alarms." },
    ],
    areasWeSupply: [
      { title: "Dartford Town Centre", body: "Shops, flats and local businesses near the town centre use everyday bulbs, ceiling lights and downlights." },
      { title: "Bluewater", body: "Retail and leisure venues near Bluewater suit RGB strips, downlights and decorative bulbs." },
      { title: "Stone", body: "Family homes near Stone call for ceiling lights, bulbs and safety devices." },
      { title: "Swanscombe", body: "New-build and established homes near Swanscombe create steady demand for fit-out lighting." },
    ],
    whyBuy: [
      { title: "Trade and Retail Pricing", body: "Fair pricing for retailers, builders and homeowners. Ask about a trade account for repeat supply." },
      { title: "Free UK Delivery Over £100 +VAT", body: "Combine your bulbs, strips and fittings into one order to unlock free delivery." },
      { title: "14-Day Returns", body: "Simple returns give you confidence on larger orders." },
      { title: "24/7 Support", body: "Real people ready to help with fittings, wattage and colour temperature." },
    ],
    faqs: [
      { title: "Do you supply shops and leisure venues near Dartford?", body: "Yes. We supply retail and leisure businesses as well as trades. [Contact us](/contact) to discuss trade pricing and bulk orders." },
      { title: "Can I use LED bulbs in older light fittings?", body: "In most cases yes, once you match the cap type, such as GU10, E14, E27 or B22. Check your existing bulb or fitting before ordering." },
      { title: "Which bulbs suit a shop display?", body: "Warm white feels inviting, while cool white looks bright and clean. RGB strips add colour accents for displays. Check the product page for colour temperature and details." },
      { title: "Can contractors open a trade account near Dartford?", body: "Yes. [Contact our team](/contact) to discuss quantities, pricing and repeat supply." },
      { title: "Do you deliver across the Kent border?", body: "We deliver across the UK, with free delivery on orders over £100 +VAT." },
    ],
    tradeCtaIntro: "Starting a fit-out or build near Dartford? Speak to our team about trade pricing, bulk orders and repeat supply.",
    nearbyAreas: ["bexley", "greenwich", "thamesmead", "grays"],
  },
};

export const areaPageOrder = [
  "newham",
  "barking-and-dagenham",
  "redbridge",
  "tower-hamlets",
  "waltham-forest",
  "bexley",
  "greenwich",
  "hackney",
  "havering",
  "islington",
  "thamesmead",
  "chigwell",
  "brentwood",
  "grays",
  "basildon",
  "dartford",
];

export const regionInfo: Record<AreaRegion, { label: string; base: string }> = {
  london: { label: "London", base: "/led-lighting-london" },
  essex: { label: "Essex", base: "/led-lighting-essex" },
  kent: { label: "Kent", base: "/led-lighting-kent" },
};

export function areaHref(slug: string): string {
  const region = areaPages[slug]?.region ?? "london";
  return `${regionInfo[region].base}/${slug}`;
}

export function areaSlugsForRegion(region: AreaRegion): string[] {
  return areaPageOrder.filter((s) => (areaPages[s].region ?? "london") === region);
}
