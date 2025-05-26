/**
 * Iconify API utility
 */
export const IconifyAPI = {
  baseURL: 'https://api.iconify.design',

  // Correctly mapped prefixes for proper API usage
  prefixMapping: {
    'fa': 'fa-solid',
    'fa-brands': 'fa-brands',
    'fa-regular': 'fa-regular'
  },

  // Get the correct API prefix
  getCorrectPrefix(prefix) {
    return this.prefixMapping[prefix] || prefix;
  },

  // Search for icons in a specific collection
  async searchIcons(query, collection) {
    try {
      const apiPrefix = this.getCorrectPrefix(collection);
      console.log(`Searching for "${query}" in collection "${apiPrefix}"...`);

      const response = await fetch(`${this.baseURL}/search?query=${encodeURIComponent(query)}&prefix=${encodeURIComponent(apiPrefix)}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Found ${(data.icons || []).length} icons in response:`, data);

      const icons = (data.icons || []).map(icon => {
        if (icon.includes(':')) {
          return icon.split(':')[1];
        }
        return icon;
      });

      return icons;
    } catch (error) {
      console.error('Error searching icons:', error);
      return [];
    }
  },

  // Get SVG data for an icon
  async getIconSVG(prefix, name) {
    try {
      const apiPrefix = this.getCorrectPrefix(prefix);
      console.log(`Fetching SVG for ${apiPrefix}:${name}`);

      let iconName = name;
      if (name.includes(':')) {
        iconName = name.split(':')[1];
      }

      const url = `${this.baseURL}/${apiPrefix}/${iconName}.svg`;
      console.log(`Requesting SVG from: ${url}`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
      }

      const svgText = await response.text();
      return svgText;
    } catch (error) {
      console.error(`Error fetching SVG for ${prefix}:${name}:`, error);
      return null;
    }
  }
};

// Popular icon collections
export const popularCollections = {
  'mdi': 'Material Design Icons',
  'fa-solid': 'Font Awesome (Solid)',
  'fa-regular': 'Font Awesome (Regular)',
  'fa-brands': 'Font Awesome (Brands)',
  'bi': 'Bootstrap Icons',
  'carbon': 'Carbon',
  'ph': 'Phosphor',
  'fluent': 'Fluent UI',
  'heroicons': 'Heroicons',
  'tabler': 'Tabler'
};