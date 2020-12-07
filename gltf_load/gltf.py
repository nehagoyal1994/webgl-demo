import numpy as np
import base64


VERTICES = []
INDICES = []
#cube = []
with open('cube.obj' , 'r') as f:
  for line in f:
      token = line.split()
      if not token:
          continue
      if token[0] == 'v':
          VERTICES.append([float(v) for v in token[1:]])
      elif token[0] == 'f':
          INDICES.append([ int(v)-1 for v in token[1:] ])
          

MAX_X = int(max(map(lambda x: x[0], VERTICES)))

MAX_Y = int(max(map(lambda x: x[1], VERTICES)))
MAX_Z = int(max(map(lambda x: x[2], VERTICES)))
MIN_X = int(min(map(lambda x: x[0], VERTICES)))

MIN_Y = int(min(map(lambda x: x[1], VERTICES)))
MIN_Z = int(min(map(lambda x: x[2], VERTICES)))
MAX = np.max(INDICES)
MIN = np.min(INDICES)




VERTICES = np.array([value for item in VERTICES for value in item ], dtype=np.float32)
INDICES = np.array([value for item in INDICES for value in item ], dtype=np.ushort)

HOWMANY_V = len(VERTICES)/3
HOWMANY_I = len(INDICES)

HOWMANYBYTES_V = VERTICES.nbytes
HOWMANYBYTES_I = INDICES.nbytes

B64_VERTICES = base64.b64encode(VERTICES)
B64_INDICES = base64.b64encode(INDICES)

gltf = {
    "asset": {
        "version": "2.0",
        "generator": "CS460 Magic Fingers"
    },

  "accessors": [
        {
            "bufferView": 0,
            "byteOffset": 0,
            "componentType": 5126,
            "count": HOWMANY_V,
            "type": "VEC3",
            "max": [MAX_X, MAX_Y, MAX_Z],
            "min": [MIN_X, MIN_Y, MIN_Z]
        },
        {
            "bufferView": 1,
            "byteOffset": 0,
            "componentType": 5123,
            "count": HOWMANY_I,
            "type": "SCALAR",
            "max": [MAX],
            "min": [MIN]
        }
    ], 

    "bufferViews": [
        {
            "buffer": 0,
            "byteOffset": 0,
            "byteLength": HOWMANYBYTES_V,
            "target": 34962
        },
        {
            "buffer": 1,
            "byteOffset": 0,
            "byteLength": HOWMANYBYTES_I,
            "target": 34963
        }
    ],
    
    "buffers": [
        {
            "uri": "data:application/octet-stream;base64,"+str(B64_VERTICES, 'utf-8'),
            "byteLength": HOWMANYBYTES_V
        },
        {
            "uri": "data:application/octet-stream;base64,"+str(B64_INDICES, 'utf-8'),
            "byteLength": HOWMANYBYTES_I
        }
    ],
    
    "materials": [
        {
            
            "pbrMetallicRoughness": {
                "baseColorFactor": [ 1.000, 0.766, 0.336, 1.0 ],
                "metallicFactor": 1.0,
                "roughnessFactor": 0.0
            }
        }
    ],  
    "meshes": [
        {
            "primitives": [{
                 "mode": 4,
                 "attributes": {
                     "POSITION": 0
                 },
                 "material": 0,
                 "indices": 1
            }]
        }
    ],

    "nodes": [
        {
            "mesh": 0
        }
    ],

    "scenes": [
        {
            "nodes": [
                0
            ]
        }
    ],

    "scene": 0
}

print ( str(gltf).replace("'", '"') ) # we need double quotes instead of single quotes


