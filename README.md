# @allegro/convert-description

A JavaScript library to convert HTML-rich offer & product descriptions into a format accepted by [Allegro Rest API].

## Motivation

Provide means to ease the conversion of HTML-rich offer & product descriptions into a format accepted by [Allegro Rest API].
As such, the library covers basic functionality. Any client-specific behavior must be provided externally. The
library can facilitate that through extensibility.

## Requirements

The library requires [DOM API], which can be provided in two ways: either implicitly
as globals by the browser environment or explicitly as the `parseToDOM` function in the Node.js environment (see
[Usage](#usage) section).

The following requirements apply to Node.js as a runtime or build environment.

* node version >=20
* npm version >=10

## Installation

```shell
npm i @allegro/convert-description
```

For the Node.js runtime environment, include [jsdom].

```shell
npm i @allegro/convert-description jsdom
```

## Usage

JavaScript code

```javascript
import { convertDescriptionToItems } from '@allegro/convert-description';

const description = `
    <div>
          <div>test content</div>
          <img src="/test_url" />
    </div>
    `;

const items = convertDescriptionToItems(description);

console.log(JSON.stringify(items));
```

Code output

```json
[{"type":"TEXT","content":"<p>test content</p>"},{"type":"IMAGE","url":"/test_url"}]
```

For the Node.js runtime environment, pass the `parseToDOM` function.

```javascript
import { convertDescriptionToItems } from '@allegro/convert-description';
import { JSDOM } from 'jsdom';

function parseToDOM(html) {
  return new JSDOM(html);
}

const description = `
    <div>
          <div>test content</div>
          <img src="/test_url" />
    </div>
    `;
const items = convertDescriptionToItems(description, { parseToDOM });

console.log(JSON.stringify(items));
```

> [!CAUTION]
> Any option to `convertDescriptionToItems` that is not mentioned in the documentation is subject to change. If you
> need anything more than the listed options, ask a question by opening an issue or contribute by creating a pull
> request.

[Allegro Rest API]: https://developer.allegro.pl/tutorials/list-offer-assigned-product-one-request-D7Kj9M71Bu6
[DOM API]: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
[jsdom]: https://github.com/jsdom/jsdom
