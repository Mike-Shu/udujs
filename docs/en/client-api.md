# API: client methods

**[Русская версия здесь.]**

These methods are available only on the client (<code>in browsers</code>).

* [.popup()](#popup)
* [.popupReset()](#popupReset)
* [.show()](#show)
* [.observer()](#observer)

<a name="popup"></a>
## .popup(value, [comment])

Displays debugging information in the list in a pop-up message in the browser window.
This method returns nothing.

| Parameter | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | A value of any type. |
| [comment] | <code>string</code> | Additional explanatory comment to the displayed value. |

<a name="popupReset"></a>
## .popupReset()

Clears the list in a pop-up message.
This method returns nothing.

<a name="show"></a>
## .show(value, [comment])

A universal method for displaying debugging information.
Outputs either to the console or to a pop-up message.
The output direction is controlled via the configuration (_parameter <code>[showOutputDirection]</code>_).
By default, the information is displayed in a pop-up message.
This method returns nothing.

| Parameter | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | A value of any type. |
| [comment] | <code>string</code> | Additional explanatory comment to the displayed value. |

<a name="observer"></a>
## .observer(value)

Displays debug information in a fixed field in a pop-up message.
This method returns nothing.

| Parameter | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>number</code> \| <code>boolean</code> | Any value of a valid type: string, number or boolean. |

[Русская версия здесь.]:../ru/client-api.md "API: клиентские методы"
[showOutputDirection]:./custom-settings.md#showOutputDirection
