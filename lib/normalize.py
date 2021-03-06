class Normalize:
  def __init__(self, t, r=None):
    self.type = t
    self.reference = r

  def __2i(self, v):
    if isinstance(v, list):
      v = ''.join(v)

    if isinstance(v, str):
      return int(v)

    if isinstance(v, float):
      return int(v)

  def __2s(self, v):
    if isinstance(v, list):
      v = ''.join(v)
    return v

  def __2l(self, v):
    if isinstance(v, str):
      return v.split(',')

  def __2b(self, v):
    if isinstance(v, list):
      v = ''.join(v)

    if isinstance(v, int):
      return bool(v)

    if isinstance(v, str):
      v = v.lower()

      if v == 'false':
        return False
      elif v == 'true':
        return True

  def convert(self, v):
    if not v:
      return v

    if self.type == 'list':
      if isinstance(v, list):
        if 'schema' in self.reference and 'type' in self.reference['schema']:
          normalizer = Normalize(self.reference['schema']['type'], self.reference)
          for i in range(len(v)):
            v[i] = normalizer.convert(v[i])

        return v
      else:
        return self.__2l(v)

    elif self.type in ['string', 'uuid', 'email', 'ip']:
      if isinstance(v, str):
        return v
      else:
        return self.__2s(v)

    elif self.type in ['integer', 'steamid64']:
      if isinstance(v, int):
        return v
      else:
        return self.__2i(v)

    elif self.type == 'boolean':
      if isinstance(v, bool):
        return v
      else:
        return self.__2b(v)

    else:
      return v
