# -*- coding: utf-8 -*-
import json


class Ok:
    value: any = None

    def __init__(self, value) -> None:
        self.value = value

        if isinstance(value, Ok):
            self.value = value.value

    @property
    def is_ok(self) -> bool:
        return True

    @property
    def is_err(self) -> bool:
        return False

    @property
    def ok(self):
        return self.value

    @property
    def err(self):
        return None

    def to_string(self):
        if self.value:
            return f'Ok: {json.dumps(self.value)}'
        return 'Ok'

    def to_json(self):
        return {
            'Ok': '' if self.value == None else self.value
        }


class Err:
    def __init__(self, error) -> None:
        self._error = error

        if isinstance(error, Err):
            self._error = error._error

    @property
    def is_ok(self) -> bool:
        return False

    @property
    def is_err(self) -> bool:
        return True

    @property
    def ok(self):
        return None

    @property
    def err(self):
        return self._error

    def to_string(self):
        if self._error:
            return f'Error: {json.dumps(self._error)}'
        return 'Error'

    def to_json(self):
        error = '' if self._error == None else self._error
        error = str(error) if isinstance(error, Exception) else error
        return {'Error': error}
