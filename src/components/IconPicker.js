import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
  Modal,
  Button,
  TextControl,
  ButtonGroup,
  Spinner
} from '@wordpress/components';
import { IconifyAPI, popularCollections } from '../utils/iconify-api';

const IconPicker = ({ isOpen, onClose, onSelect, currentIcon }) => {
  const [iconSearchQuery, setIconSearchQuery] = useState('');
  const [iconCollection, setIconCollection] = useState('mdi');
  const [iconSearchResults, setIconSearchResults] = useState([]);
  const [isLoadingIcons, setIsLoadingIcons] = useState(false);

  // Search for icons
  const searchIcons = async () => {
    const query = iconSearchQuery.trim();
    const collection = iconCollection;

    if (!collection) {
      console.error('Please select a collection from the dropdown');
      return;
    }

    if (!query) {
      console.error('Please enter a search query');
      return;
    }

    console.log(`Searching for "${query}" in "${collection}" collection`);
    setIsLoadingIcons(true);
    setIconSearchResults([]);

    try {
      const icons = await IconifyAPI.searchIcons(query, collection);

      if (icons.length === 0) {
        console.log(`No results found for "${query}" in "${collection}"`);
        setIconSearchResults([]);
        setIsLoadingIcons(false);
        return;
      }

      console.log(`Found ${icons.length} results`);

      const iconResults = [];

      for (const iconName of icons) {
        const svgContent = await IconifyAPI.getIconSVG(collection, iconName);

        if (svgContent) {
          iconResults.push({
            id: `${collection}:${iconName}`,
            name: iconName,
            svg: svgContent
          });
        }
      }

      setIconSearchResults(iconResults);
    } catch (error) {
      console.error('Error searching for icons:', error);
      setIconSearchResults([]);
    } finally {
      setIsLoadingIcons(false);
    }
  };

  const handleIconSelect = async (iconId, iconSvg = null) => {
    if (iconId.includes(':') && iconSvg) {
      onSelect(iconId, iconSvg);
    } else if (iconId.includes(':')) {
      // Fetch SVG for iconify icons
      const [prefix, name] = iconId.split(':');
      const svgContent = await IconifyAPI.getIconSVG(prefix, name);
      onSelect(iconId, svgContent);
    }

    onClose();
    setIconSearchQuery('');
    setIconSearchResults([]);
  };

  if (!isOpen) return null;

  return (
    <Modal
      title={__('Search Icons', 'ekwa-wufoo-form-builder')}
      onRequestClose={onClose}
      className="ekwa-icon-picker-modal"
    >
      <div className="ekwa-icon-picker">
        <div className="ekwa-icon-picker-collections">
          <p>{__('Select Icon Collection', 'ekwa-wufoo-form-builder')}</p>
          <ButtonGroup className="ekwa-icon-collections">
            {Object.entries(popularCollections).map(([value, label]) => (
              <Button
                key={value}
                variant={iconCollection === value ? 'primary' : 'secondary'}
                onClick={() => setIconCollection(value)}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <div className="ekwa-icon-search">
          <div className="ekwa-icon-search-input">
            <TextControl
              label={__('Search Icons', 'ekwa-wufoo-form-builder')}
              value={iconSearchQuery}
              onChange={setIconSearchQuery}
              placeholder={__('E.g. user, email, phone...', 'ekwa-wufoo-form-builder')}
            />
            <Button
              variant="primary"
              onClick={searchIcons}
              disabled={!iconSearchQuery || isLoadingIcons}
            >
              {__('Search', 'ekwa-wufoo-form-builder')}
            </Button>
          </div>

          {isLoadingIcons && (
            <div className="ekwa-icon-loading">
              <Spinner />
              <p>{__('Searching icons...', 'ekwa-wufoo-form-builder')}</p>
            </div>
          )}

          {!isLoadingIcons && iconSearchResults.length > 0 && (
            <div className="ekwa-icon-results">
              {iconSearchResults.map((icon) => (
                <Button
                  key={icon.id}
                  className="ekwa-icon-result"
                  onClick={() => handleIconSelect(icon.id, icon.svg)}
                >
                  <div
                    className="ekwa-icon-svg-container"
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                  />
                  <span className="ekwa-icon-name">{icon.name}</span>
                </Button>
              ))}
            </div>
          )}

          {!isLoadingIcons && iconSearchQuery && iconSearchResults.length === 0 && (
            <div className="ekwa-icon-no-results">
              <p>{__('No icons found. Try a different search term.', 'ekwa-wufoo-form-builder')}</p>

              <div className="ekwa-fallback-icons">
                <h4>{__('Popular Form Icons', 'ekwa-wufoo-form-builder')}</h4>
                <div className="ekwa-icon-results ekwa-fallback-grid">
                  {[
                    { id: 'mdi:account-outline', name: 'user', collection: 'mdi' },
                    { id: 'mdi:email-outline', name: 'email', collection: 'mdi' },
                    { id: 'mdi:phone-outline', name: 'phone', collection: 'mdi' },
                    { id: 'mdi:lock-outline', name: 'password', collection: 'mdi' },
                    { id: 'mdi:text-box-outline', name: 'text', collection: 'mdi' },
                    { id: 'mdi:format-list-bulleted', name: 'list', collection: 'mdi' },
                    { id: 'mdi:card-text-outline', name: 'textarea', collection: 'mdi' },
                    { id: 'mdi:checkbox-outline', name: 'checkbox', collection: 'mdi' },
                    { id: 'mdi:radiobox-marked', name: 'radio', collection: 'mdi' },
                    { id: 'mdi:form-select', name: 'select', collection: 'mdi' },
                    { id: 'mdi:web', name: 'url', collection: 'mdi' },
                    { id: 'mdi:numeric', name: 'number', collection: 'mdi' }
                  ].map((icon) => (
                    <Button
                      key={icon.id}
                      className="ekwa-icon-result"
                      onClick={async () => {
                        const svgContent = await IconifyAPI.getIconSVG(icon.collection, icon.name);
                        if (svgContent) {
                          handleIconSelect(icon.id, svgContent);
                        }
                      }}
                    >
                      <div className="ekwa-icon-svg-container">
                        <img
                          src={`https://api.iconify.design/${icon.id}.svg`}
                          alt={icon.name}
                          width="24"
                          height="24"
                        />
                      </div>
                      <span className="ekwa-icon-name">{icon.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default IconPicker;