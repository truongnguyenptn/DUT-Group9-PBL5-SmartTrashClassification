import { useToggle } from '@enouvo/react-hooks';
import type { AutoCompleteProps } from 'antd';
import { AutoComplete, Form } from 'antd';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

interface AddressSelectorProps {
  onChange?: (value: string) => void;
  townName?: string;
  countryName?: string;
  postalCodeName?: string;
  coordinatesName?: string;
}

enum Status {
  OK = 'OK',
}

function AddressSelector({
  onClear,
  onChange,
  townName = 'town',
  countryName = 'country',
  postalCodeName = 'postalCode',
  coordinatesName = 'coordinates',
  ...rest
}: AddressSelectorProps & AutoCompleteProps) {
  const [visible, open] = useToggle(false);
  const form = Form.useFormInstance();

  const {
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete({
    debounce: 400,
  });

  const handleChange = (e: string) => {
    onChange?.(e);
    setValue(e);
  };

  const handleSelect = async (e: string) => {
    const results = await getGeocode({ address: e });
    const coordinates = await getLatLng(results[0]);

    const country = results[0].address_components.find(
      (resultCountry: { types: string[] }) =>
        resultCountry.types[0] === 'country',
    );

    const town = results[0].address_components.find(
      (resultTown: { types: string[] }) =>
        resultTown.types[0] === 'administrative_area_level_1',
    );
    const postalCode = results[0].address_components.find(
      (resultTown: { types: string[] }) =>
        resultTown.types[0] === 'postal_code',
    );

    form.setFieldsValue({
      [coordinatesName]: {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      },
      [countryName]: country?.long_name,
      [postalCodeName]: postalCode?.long_name,
      [townName]: town?.long_name,
    });
  };

  const renderSuggestions = data.map(suggestion => {
    const {
      structured_formatting: {
        ['main_text']: mainText,
        ['secondary_text']: secondaryText,
      },
    } = suggestion;
    return {
      label: `${mainText} ${secondaryText}`,
      value: `${mainText} ${secondaryText}`,
    };
  });

  return (
    <>
      <AutoComplete<string>
        allowClear={visible}
        dropdownMatchSelectWidth={320}
        id="searchPlaces-control"
        onChange={handleChange}
        onClear={onClear}
        onClick={open}
        onSelect={handleSelect}
        options={status === Status.OK && visible ? renderSuggestions : []}
        {...rest}
      />
      <Form.Item hidden name={coordinatesName}>
        <Form.Item name={[coordinatesName, 'longitude']}></Form.Item>
        <Form.Item name={[coordinatesName, 'latitude']}></Form.Item>
      </Form.Item>
    </>
  );
}

export default AddressSelector;
