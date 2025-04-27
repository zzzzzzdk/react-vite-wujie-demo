
import { useEffect, useState } from 'react'
import { Button } from '@yisa/webui'
import './index.scss'
import G6 from '@antv/g6';
import VehiclePng from '@/assets/images/vehicle_.png'
export default () => {
  const elements = [
    {
      "user_details": {
        "_id": "personnel_info/111-371521198410264915",
        "_key": "111-371521198410264915",
        "_rev": "_gvg7ZT6--_",
        "account_info": [],
        "birthday": 19841026,
        "car_info": [],
        "country": "",
        "create_time": 1686217342,
        "education": "90",
        "faith": "00",
        "foreign_name": "",
        "gender": 1,
        "household_address": "223",
        "household_code": 120103,
        "id_number": "371521198410264915",
        "id_type": 111,
        "importCare": "2",
        "is_special": false,
        "marital": "90",
        "label": "孙维",
        "nation": "",
        "native_place_address": "",
        "native_place_code": 0,
        "phone_info": {
          "imei": [],
          "imsi": [],
          "mac": [],
          "phone_number": []
        },
        "photos": [
          {
            "f": "Q6RAKVGqb6xMo5As8qeYqMsmqygImJ2qrqmYKkYqUCecHlYtiCO/oecoUCzGqyWqvilkKpyiEyeMJB6sE6fPpkspMCrEKrah4agsKF4i/Kf7oSWoVaVSp+GrbirqnSMq46jmJ36p8iMoKeOmhqjHLq0mOishpZOmfKHKpZqRwCUIrDwhzSXpsHMrjBlirCSrKywXqaCYmKLNpWYpiCm6HRUoyaCJHe8UJSYSlhGUnRVnJt0ltaEtJpgouCK9o/ipuKh9pzApYKkMKhEdF6s/rNYpu6XKocusnijTqzioDKscKWyeIydApDohOCXxrB8kop9JJlYlD6AHKXArmSj+J2semazuqfGkXyxYJeSg+iszKLypvCM1rW4qeaeULN+pQKaMqqQmDqVBrWwrkKhXqXKuC6Z9qxGnBSHep18pHqK1J4KwGSUDKGisy5C8KXSn/aRDGmMoPal+H+6jB6fYKA2nsSRzgCsoLaokLJqqCikFrGMlZa0mqiamf6KIJs2l8STWJXqpnCMfptylJi1HrnipVyrWocsY3Rg4JLyJAKxErrqssKkdKMKp3Ji7pg+meSHNlQAn6hX/otItZS15J2giBaxLrQqkpCoNJEUZ66vzHYUaeaZ8Il+l6CurqACmXyPzIXciS61DojypGatBKlccmyjTp76mR60cJc2nKCa8JF6pzClRqE8tHiNQKtUoDaRELE8cCyoSqt2nZx2opfSjpKaVqdWg2CZdJlQshSm3pqelOahlp9aXJC1xGOYhJKARKpCn/KfmKFYjtaslJ/Aj8yhjrPynqxlxrxKwOqwhLDUspaCfqv4be6rXF/GpTB7kISktcKnmqk4qZyzTF3KonqhoqCutoiUmLbQoOqzBKCuoWqQUKJGo8KdZK2imLCKaI8yfk6z5KgAuQKUmpA4Y3qqgJJocJSsGKU4laq28JHMpipkyILyk+Cv7KBKopas5KuClwqXpHL0fnCYbKA4pZZoJLbGs0Cs2LB+soqGwpvsnd6CCnmgaQCoHI/0uXCPmpnalqyz6Ii8rCy4DqZMqOiFUKNGkG6ZXpfApPCbWoS4sh6EpppyqPyqQnmctNydbIAKpm6FSo3+o0y3wpX2gsKA6KjSfnyqLJOaeSymNo2+ROCjPLOqdr6kFHNWk46vuKFSsBifWJWao2qHorCsoPJsVLreosSQwKEIsCKg5qm2pyibKpVouPaFJJIiraqB7pq8t+SoiJJig1KSRJe0ocCluKeGsOCvfpHcseiv7qbwcK6ViHSUsGKmYLIycqyniLvgjUK59KC6rRKWuqVuuVCw0KGClPSUOqXcoHK4rKk8dPiWfJj2uTqz7oCOkSZ7RD2wpdCmHKXurPya3rA==",
            "p": "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.80%3A9081%2F1725%2Ca072b132513d15",
            "t": 0
          }
        ],
        "population_status": "0",
        "relationship_info": {
          "FQXX": {
            "id_number": "342622200011091591",
            "id_type": 111,
            "label": "张三"
          }
        },
        "residential_address": "22",
        "residential_code": 130203,
        "source": 1,
        "special_info": [],
        "update_time": 1696927149,
        "work_unit": ""
      },
      "v": {
        "_from": "personnel_info/111-371521198410264915",
        "_id": "personnel_info/111-371521198410264915",
        "_key": "111-371521198410264915",
        "_rev": "_gvg7ZT6--_",
        "_to": "personnel_info/111-342622200011091591",
        "account_info": [],
        "birthday": 19841026,
        "car_info": [],
        "count": 0,
        "country": "",
        "create_time": 1686217342,
        "describe": "亲属关系",
        "details": null,
        "education": "90",
        "faith": "00",
        "foreign_name": "",
        "gender": 1,
        "household_address": "223",
        "household_code": 120103,
        "id_number": "371521198410264915",
        "id_type": 111,
        "importCare": "2",
        "is_special": false,
        "marital": "90",
        "label": "孙维",
        "nation": "",
        "native_place_address": "",
        "native_place_code": 0,
        "phone_info": {
          "imei": [],
          "imsi": [],
          "mac": [],
          "phone_number": []
        },
        "photos": [
          {
            "f": "Q6RAKVGqb6xMo5As8qeYqMsmqygImJ2qrqmYKkYqUCecHlYtiCO/oecoUCzGqyWqvilkKpyiEyeMJB6sE6fPpkspMCrEKrah4agsKF4i/Kf7oSWoVaVSp+GrbirqnSMq46jmJ36p8iMoKeOmhqjHLq0mOishpZOmfKHKpZqRwCUIrDwhzSXpsHMrjBlirCSrKywXqaCYmKLNpWYpiCm6HRUoyaCJHe8UJSYSlhGUnRVnJt0ltaEtJpgouCK9o/ipuKh9pzApYKkMKhEdF6s/rNYpu6XKocusnijTqzioDKscKWyeIydApDohOCXxrB8kop9JJlYlD6AHKXArmSj+J2semazuqfGkXyxYJeSg+iszKLypvCM1rW4qeaeULN+pQKaMqqQmDqVBrWwrkKhXqXKuC6Z9qxGnBSHep18pHqK1J4KwGSUDKGisy5C8KXSn/aRDGmMoPal+H+6jB6fYKA2nsSRzgCsoLaokLJqqCikFrGMlZa0mqiamf6KIJs2l8STWJXqpnCMfptylJi1HrnipVyrWocsY3Rg4JLyJAKxErrqssKkdKMKp3Ji7pg+meSHNlQAn6hX/otItZS15J2giBaxLrQqkpCoNJEUZ66vzHYUaeaZ8Il+l6CurqACmXyPzIXciS61DojypGatBKlccmyjTp76mR60cJc2nKCa8JF6pzClRqE8tHiNQKtUoDaRELE8cCyoSqt2nZx2opfSjpKaVqdWg2CZdJlQshSm3pqelOahlp9aXJC1xGOYhJKARKpCn/KfmKFYjtaslJ/Aj8yhjrPynqxlxrxKwOqwhLDUspaCfqv4be6rXF/GpTB7kISktcKnmqk4qZyzTF3KonqhoqCutoiUmLbQoOqzBKCuoWqQUKJGo8KdZK2imLCKaI8yfk6z5KgAuQKUmpA4Y3qqgJJocJSsGKU4laq28JHMpipkyILyk+Cv7KBKopas5KuClwqXpHL0fnCYbKA4pZZoJLbGs0Cs2LB+soqGwpvsnd6CCnmgaQCoHI/0uXCPmpnalqyz6Ii8rCy4DqZMqOiFUKNGkG6ZXpfApPCbWoS4sh6EpppyqPyqQnmctNydbIAKpm6FSo3+o0y3wpX2gsKA6KjSfnyqLJOaeSymNo2+ROCjPLOqdr6kFHNWk46vuKFSsBifWJWao2qHorCsoPJsVLreosSQwKEIsCKg5qm2pyibKpVouPaFJJIiraqB7pq8t+SoiJJig1KSRJe0ocCluKeGsOCvfpHcseiv7qbwcK6ViHSUsGKmYLIycqyniLvgjUK59KC6rRKWuqVuuVCw0KGClPSUOqXcoHK4rKk8dPiWfJj2uTqz7oCOkSZ7RD2wpdCmHKXurPya3rA==",
            "p": "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.80%3A9081%2F1725%2Ca072b132513d15",
            "t": 0
          }
        ],
        "population_status": "0",
        "relation_create_time": 1696927148,
        "relation_name": "父子关系",
        "relation_type": 2,
        "relation_update_time": 1696927148,
        "relationship_info": {
          "FQXX": {
            "id_number": "342622200011091591",
            "id_type": 111,
            "label": "张三"
          }
        },
        "residential_address": "22",
        "residential_code": 130203,
        "source": 1,
        "special_info": [],
        "update_time": 1696927149,
        "use_status": 0,
        "work_unit": ""
      },
      "id": "d29e32d4098f9460d84cf4c082c751b2",
      "_key": "111-371521198410264915",
      "token": "4da4d46631ea6ea5a0e25844742ee90c_111-371521198410264915",
      "label": "孙维",
      "id_card": "371521198410264915",
      // "type": 0,
      "category": "person",
      "relation": "父子关系",
      "description": "父子关系",
      "count": 0,
      "jumpUrl": "./?c=person_case_info&m=index&idCard=371521198410264915&id_type=111",
      "jumpRecordUrl": "",
      "paper_type": 111,
      "paper_type_text": "身份证",
      "description_": "同户籍人关系",
      "image_url": "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504287113109961e%2B17_2e90f810-9621-11ed-97be-ac1f6bfc9d56.jpg&xywh=668,902,81,104&cut_img",
      "level": 1,
      "tokenArr": [
        {
          "source_id": "e2c13ddaae7f77dcfdf5a68029cecf67",
          "token": "4da4d46631ea6ea5a0e25844742ee90c_111-371521198410264915"
        }
      ],
    },
    {
      "user_details": null,
      "v": {
        "_from": "personnel_info/111-342622200011091591",
        "_id": "car_info/02-6bKBQTEyMzQ1",
        "_key": "02-6bKBQTEyMzQ1",
        "_rev": "_gmyuIcO--_",
        "_to": "car_info/02-6bKBQTEyMzQ1",
        "count": 0,
        "create_time": 1694049170,
        "describe": "车辆",
        "details": null,
        "issue_date": "",
        "license_plate": "鲁A12345",
        "owner_key": "111-342622200011091591",
        "plate_type": "02",
        "register_address": "",
        "relation_create_time": 1694049170,
        "relation_name": "车辆",
        "relation_type": 17,
        "relation_update_time": 1694049170,
        "source": 1,
        "update_time": 1694585858,
        "use_status": 0,
        "vehicle_color": "Z",
        "vehicle_model1": "",
        "vehicle_model2": "",
        "vehicle_status": "",
        "vehicle_type": "X99"
      },
      "id": "c3a73dfc5b6cc5fd6b913cd3625c235a",
      "_key": "02-6bKBQTEyMzQ1",
      "token": "4da4d46631ea6ea5a0e25844742ee90c_02-6bKBQTEyMzQ1",
      "label": "鲁A12345",
      "id_card": "",
      // "type": "",
      "category": "vehicle",
      "relation": "车辆",
      "description": "---",
      "count": 0,
      "jumpUrl": "http://192.168.5.76:8021/Vehicle/?m=results&c=analysis_carinf&plate_number=鲁A12345&plate_type_id=4,14",
      "jumpRecordUrl": "",
      "paper_type": null,
      "paper_type_text": "",
      "idCard": "",
      "image_url": "http://192.168.5.76:8021/img.php?img_uuid=aHR0cDovLzE5Mi4xNjguNy4yMDY6ODAwMC8xMjVlNzc2ZS01NGFkLTExZWMtODhiMC0wY2M0N2E5YzRiOTcuanBn&cut_img=1&base64=1&xywh=1520,1005,994,1032",
      "level": 1,
      "tokenArr": [
        {
          "source_id": "e2c13ddaae7f77dcfdf5a68029cecf67",
          "token": "4da4d46631ea6ea5a0e25844742ee90c_02-6bKBQTEyMzQ1"
        }
      ]
    },
    {
      "user_details": {
        "_id": "personnel_info/111-342622199011091591",
        "_key": "111-342622199011091591",
        "_rev": "_gk4Jp0----",
        "birthday": 0,
        "country": "",
        "create_time": 1694071762,
        "education": "90",
        "faith": "90",
        "foreign_name": "",
        "gender": 1,
        "household_address": "",
        "household_code": 0,
        "id_number": "342622199011091591",
        "id_type": 111,
        "is_special": false,
        "marital": "90",
        "label": "他老婆",
        "nation": "",
        "native_place_address": "",
        "native_place_code": 0,
        "photos": [],
        "population_status": 0,
        "residential_address": "",
        "residential_code": 0,
        "source": 1,
        "special_info": [],
        "update_time": 1694071762,
        "work_unit": ""
      },
      "v": {
        "_from": "personnel_info/111-342622200011091591",
        "_id": "personnel_info/111-342622199011091591",
        "_key": "111-342622199011091591",
        "_rev": "_gk4Jp0----",
        "_to": "personnel_info/111-342622199011091591",
        "birthday": 0,
        "count": 0,
        "country": "",
        "create_time": 1694071762,
        "describe": "夫妻关系",
        "details": [],
        "education": "90",
        "faith": "90",
        "foreign_name": "",
        "gender": 1,
        "household_address": "",
        "household_code": 0,
        "id_number": "342622199011091591",
        "id_type": 111,
        "is_special": false,
        "marital": "90",
        "label": "他老婆",
        "nation": "",
        "native_place_address": "",
        "native_place_code": 0,
        "photos": [],
        "population_status": 0,
        "relation_create_time": 1694080825,
        "relation_name": "夫妻关系",
        "relation_type": 1,
        "relation_update_time": 1694080825,
        "residential_address": "",
        "residential_code": 0,
        "source": 1,
        "special_info": [],
        "update_time": 1694071762,
        "use_status": 0,
        "work_unit": ""
      },
      "id": "f89ac730d88cb5c9c65ebc524878fe05",
      "_key": "111-342622199011091591",
      "token": "4da4d46631ea6ea5a0e25844742ee90c_111-342622199011091591",
      "label": "他老婆",
      "id_card": "342622199011091591",
      // "type": 0,
      "category": "person",
      "relation": "夫妻关系",
      "description": "夫妻关系",
      "count": 0,
      "jumpUrl": "./?c=person_case_info&m=index&idCard=342622199011091591&id_type=111",
      "jumpRecordUrl": "",
      "paper_type": 111,
      "paper_type_text": "身份证",
      "description_": "同户籍人关系",
      "image_url": "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg&xywh=741,760,83,115&cut_img"
    },
    {
      "user_details": {
        "_id": "personnel_info/111-371521198410264915",
        "_key": "111-371521198410264915",
        "_rev": "_gvg7ZT6--_",
        "account_info": [],
        "birthday": 19841026,
        "car_info": [],
        "country": "",
        "create_time": 1686217342,
        "education": "90",
        "faith": "00",
        "foreign_name": "",
        "gender": 1,
        "household_address": "223",
        "household_code": 120103,
        "id_number": "371521198410264915",
        "id_type": 111,
        "importCare": "2",
        "is_special": false,
        "marital": "90",
        "label": "孙维",
        "nation": "",
        "native_place_address": "",
        "native_place_code": 0,
        "phone_info": {
          "imei": [],
          "imsi": [],
          "mac": [],
          "phone_number": []
        },
        "photos": [
          {
            "f": "Q6RAKVGqb6xMo5As8qeYqMsmqygImJ2qrqmYKkYqUCecHlYtiCO/oecoUCzGqyWqvilkKpyiEyeMJB6sE6fPpkspMCrEKrah4agsKF4i/Kf7oSWoVaVSp+GrbirqnSMq46jmJ36p8iMoKeOmhqjHLq0mOishpZOmfKHKpZqRwCUIrDwhzSXpsHMrjBlirCSrKywXqaCYmKLNpWYpiCm6HRUoyaCJHe8UJSYSlhGUnRVnJt0ltaEtJpgouCK9o/ipuKh9pzApYKkMKhEdF6s/rNYpu6XKocusnijTqzioDKscKWyeIydApDohOCXxrB8kop9JJlYlD6AHKXArmSj+J2semazuqfGkXyxYJeSg+iszKLypvCM1rW4qeaeULN+pQKaMqqQmDqVBrWwrkKhXqXKuC6Z9qxGnBSHep18pHqK1J4KwGSUDKGisy5C8KXSn/aRDGmMoPal+H+6jB6fYKA2nsSRzgCsoLaokLJqqCikFrGMlZa0mqiamf6KIJs2l8STWJXqpnCMfptylJi1HrnipVyrWocsY3Rg4JLyJAKxErrqssKkdKMKp3Ji7pg+meSHNlQAn6hX/otItZS15J2giBaxLrQqkpCoNJEUZ66vzHYUaeaZ8Il+l6CurqACmXyPzIXciS61DojypGatBKlccmyjTp76mR60cJc2nKCa8JF6pzClRqE8tHiNQKtUoDaRELE8cCyoSqt2nZx2opfSjpKaVqdWg2CZdJlQshSm3pqelOahlp9aXJC1xGOYhJKARKpCn/KfmKFYjtaslJ/Aj8yhjrPynqxlxrxKwOqwhLDUspaCfqv4be6rXF/GpTB7kISktcKnmqk4qZyzTF3KonqhoqCutoiUmLbQoOqzBKCuoWqQUKJGo8KdZK2imLCKaI8yfk6z5KgAuQKUmpA4Y3qqgJJocJSsGKU4laq28JHMpipkyILyk+Cv7KBKopas5KuClwqXpHL0fnCYbKA4pZZoJLbGs0Cs2LB+soqGwpvsnd6CCnmgaQCoHI/0uXCPmpnalqyz6Ii8rCy4DqZMqOiFUKNGkG6ZXpfApPCbWoS4sh6EpppyqPyqQnmctNydbIAKpm6FSo3+o0y3wpX2gsKA6KjSfnyqLJOaeSymNo2+ROCjPLOqdr6kFHNWk46vuKFSsBifWJWao2qHorCsoPJsVLreosSQwKEIsCKg5qm2pyibKpVouPaFJJIiraqB7pq8t+SoiJJig1KSRJe0ocCluKeGsOCvfpHcseiv7qbwcK6ViHSUsGKmYLIycqyniLvgjUK59KC6rRKWuqVuuVCw0KGClPSUOqXcoHK4rKk8dPiWfJj2uTqz7oCOkSZ7RD2wpdCmHKXurPya3rA==",
            "p": "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.80%3A9081%2F1725%2Ca072b132513d15",
            "t": 0
          }
        ],
        "population_status": "0",
        "relationship_info": {
          "FQXX": {
            "id_number": "342622200011091591",
            "id_type": 111,
            "label": "张三"
          }
        },
        "residential_address": "22",
        "residential_code": 130203,
        "source": 1,
        "special_info": [],
        "update_time": 1696927149,
        "work_unit": ""
      },
      "v": {
        "_from": "personnel_info/111-371521198410264915",
        "_id": "personnel_info/111-371521198410264915",
        "_key": "111-371521198410264915",
        "_rev": "_gvg7ZT6--_",
        "_to": "personnel_info/111-342622200011091591",
        "account_info": [],
        "birthday": 19841026,
        "car_info": [],
        "count": 0,
        "country": "",
        "create_time": 1686217342,
        "describe": "亲属关系",
        "details": null,
        "education": "90",
        "faith": "00",
        "foreign_name": "",
        "gender": 1,
        "household_address": "223",
        "household_code": 120103,
        "id_number": "371521198410264915",
        "id_type": 111,
        "importCare": "2",
        "is_special": false,
        "marital": "90",
        "label": "孙维",
        "nation": "",
        "native_place_address": "",
        "native_place_code": 0,
        "phone_info": {
          "imei": [],
          "imsi": [],
          "mac": [],
          "phone_number": []
        },
        "photos": [
          {
            "f": "Q6RAKVGqb6xMo5As8qeYqMsmqygImJ2qrqmYKkYqUCecHlYtiCO/oecoUCzGqyWqvilkKpyiEyeMJB6sE6fPpkspMCrEKrah4agsKF4i/Kf7oSWoVaVSp+GrbirqnSMq46jmJ36p8iMoKeOmhqjHLq0mOishpZOmfKHKpZqRwCUIrDwhzSXpsHMrjBlirCSrKywXqaCYmKLNpWYpiCm6HRUoyaCJHe8UJSYSlhGUnRVnJt0ltaEtJpgouCK9o/ipuKh9pzApYKkMKhEdF6s/rNYpu6XKocusnijTqzioDKscKWyeIydApDohOCXxrB8kop9JJlYlD6AHKXArmSj+J2semazuqfGkXyxYJeSg+iszKLypvCM1rW4qeaeULN+pQKaMqqQmDqVBrWwrkKhXqXKuC6Z9qxGnBSHep18pHqK1J4KwGSUDKGisy5C8KXSn/aRDGmMoPal+H+6jB6fYKA2nsSRzgCsoLaokLJqqCikFrGMlZa0mqiamf6KIJs2l8STWJXqpnCMfptylJi1HrnipVyrWocsY3Rg4JLyJAKxErrqssKkdKMKp3Ji7pg+meSHNlQAn6hX/otItZS15J2giBaxLrQqkpCoNJEUZ66vzHYUaeaZ8Il+l6CurqACmXyPzIXciS61DojypGatBKlccmyjTp76mR60cJc2nKCa8JF6pzClRqE8tHiNQKtUoDaRELE8cCyoSqt2nZx2opfSjpKaVqdWg2CZdJlQshSm3pqelOahlp9aXJC1xGOYhJKARKpCn/KfmKFYjtaslJ/Aj8yhjrPynqxlxrxKwOqwhLDUspaCfqv4be6rXF/GpTB7kISktcKnmqk4qZyzTF3KonqhoqCutoiUmLbQoOqzBKCuoWqQUKJGo8KdZK2imLCKaI8yfk6z5KgAuQKUmpA4Y3qqgJJocJSsGKU4laq28JHMpipkyILyk+Cv7KBKopas5KuClwqXpHL0fnCYbKA4pZZoJLbGs0Cs2LB+soqGwpvsnd6CCnmgaQCoHI/0uXCPmpnalqyz6Ii8rCy4DqZMqOiFUKNGkG6ZXpfApPCbWoS4sh6EpppyqPyqQnmctNydbIAKpm6FSo3+o0y3wpX2gsKA6KjSfnyqLJOaeSymNo2+ROCjPLOqdr6kFHNWk46vuKFSsBifWJWao2qHorCsoPJsVLreosSQwKEIsCKg5qm2pyibKpVouPaFJJIiraqB7pq8t+SoiJJig1KSRJe0ocCluKeGsOCvfpHcseiv7qbwcK6ViHSUsGKmYLIycqyniLvgjUK59KC6rRKWuqVuuVCw0KGClPSUOqXcoHK4rKk8dPiWfJj2uTqz7oCOkSZ7RD2wpdCmHKXurPya3rA==",
            "p": "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.80%3A9081%2F1725%2Ca072b132513d15",
            "t": 0
          }
        ],
        "population_status": "0",
        "relation_create_time": 1696927148,
        "relation_name": "父子关系",
        "relation_type": 2,
        "relation_update_time": 1696927148,
        "relationship_info": {
          "FQXX": {
            "id_number": "342622200011091591",
            "id_type": 111,
            "label": "张三"
          }
        },
        "residential_address": "22",
        "residential_code": 130203,
        "source": 1,
        "special_info": [],
        "update_time": 1696927149,
        "use_status": 0,
        "work_unit": ""
      },
      "id": "d29e32d4098f9460d84cf4c082c751b2",
      "_key": "111-371521198410264915",
      "token": "4da4d46631ea6ea5a0e25844742ee90c_111-371521198410264915",
      "label": "孙维",
      "id_card": "371521198410264915",
      // "type": 0,
      "category": "person",
      "relation": "父子关系",
      "description": "父子关系",
      "count": 0,
      "jumpUrl": "./?c=person_case_info&m=index&idCard=371521198410264915&id_type=111",
      "jumpRecordUrl": "",
      "paper_type": 111,
      "paper_type_text": "身份证",
      "description_": "同户籍人关系",
      "image_url": "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F188c00a0-55d6-11ec-88b0-0cc47a9c4b97.jpg&xywh=401,1249,63,86&cut_img",
      "level": 1,
      "tokenArr": [
        {
          "source_id": "e2c13ddaae7f77dcfdf5a68029cecf67",
          "token": "4da4d46631ea6ea5a0e25844742ee90c_111-371521198410264915"
        }
      ]
    },
    {
      "user_details": {
        "_id": "personnel_info/111-342622199011091594",
        "_key": "111-342622199011091594",
        "_rev": "_gk6T7qa---",
        "birthday": 0,
        "country": "",
        "create_time": 1694080825,
        "education": "90",
        "faith": "90",
        "foreign_name": "",
        "gender": 1,
        "household_address": "",
        "household_code": 0,
        "id_number": "342622199011091594",
        "id_type": 111,
        "is_special": false,
        "marital": "90",
        "label": "王五",
        "nation": "",
        "native_place_address": "",
        "native_place_code": 0,
        "photos": [],
        "population_status": 0,
        "residential_address": "",
        "residential_code": 0,
        "source": 1,
        "special_info": [],
        "update_time": 1694080825,
        "work_unit": ""
      },
      "v": {
        "_from": "personnel_info/111-342622200011091591",
        "_id": "personnel_info/111-342622199011091594",
        "_key": "111-342622199011091594",
        "_rev": "_gk6T7qa---",
        "_to": "personnel_info/111-342622199011091594",
        "birthday": 0,
        "count": 0,
        "country": "",
        "create_time": 1694080825,
        "describe": "祖父关系",
        "details": [],
        "education": "90",
        "faith": "90",
        "foreign_name": "",
        "gender": 1,
        "household_address": "",
        "household_code": 0,
        "id_number": "342622199011091594",
        "id_type": 111,
        "is_special": false,
        "marital": "90",
        "label": "王五",
        "nation": "",
        "native_place_address": "",
        "native_place_code": 0,
        "photos": [],
        "population_status": 0,
        "relation_create_time": 1694080825,
        "relation_name": "祖父关系",
        "relation_type": 31,
        "relation_update_time": 1694080825,
        "residential_address": "",
        "residential_code": 0,
        "source": 1,
        "special_info": [],
        "update_time": 1694080825,
        "use_status": 0,
        "work_unit": ""
      },
      "id": "c2624c7659d3328cbad60306687c40b5",
      "_key": "111-342622199011091594",
      "token": "4da4d46631ea6ea5a0e25844742ee90c_111-342622199011091594",
      "label": "王五",
      "id_card": "342622199011091594",
      // "type": 0,
      "category": "person",
      "relation": "祖父关系",
      "description": "祖父关系",
      "count": 0,
      "jumpUrl": "./?c=person_case_info&m=index&idCard=342622199011091594&id_type=111",
      "jumpRecordUrl": "",
      "paper_type": 111,
      "paper_type_text": "身份证",
      "description_": "同户籍人关系",
      "image_url": "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.7.214%3A9081%2F977%2C580fc6994ae8a3.jpg&xywh=256,722,177,224&cut_img",
      "level": 1,
      "tokenArr": [
        {
          "source_id": "e2c13ddaae7f77dcfdf5a68029cecf67",
          "token": "4da4d46631ea6ea5a0e25844742ee90c_111-342622199011091594"
        }
      ]
    },
    {
      "user_details": {
        "_id": "personnel_info/111-342622199011091592",
        "_key": "111-342622199011091592",
        "_rev": "_gk6T7qK---",
        "birthday": 0,
        "country": "",
        "create_time": 1694080825,
        "education": "90",
        "faith": "90",
        "foreign_name": "",
        "gender": 1,
        "household_address": "",
        "household_code": 0,
        "id_number": "342622199011091592",
        "id_type": 111,
        "is_special": false,
        "label": "李四",
        "nation": "",
        "native_place_address": "",
        "native_place_code": 0,
        "photos": [],
        "population_status": 0,
        "residential_address": "",
        "residential_code": 0,
        "source": 1,
        "special_info": [],
        "update_time": 1694080825,
        "work_unit": ""
      },
      "v": {
        "_from": "personnel_info/111-342622200011091591",
        "_id": "personnel_info/111-342622199011091592",
        "_key": "111-342622199011091592",
        "_rev": "_gk6T7qK---",
        "_to": "personnel_info/111-342622199011091592",
        "birthday": 0,
        "count": 0,
        "country": "",
        "create_time": 1694080825,
        "describe": "亲属关系",
        "details": null,
        "education": "90",
        "faith": "90",
        "foreign_name": "",
        "gender": 1,
        "household_address": "",
        "household_code": 0,
        "id_number": "342622199011091592",
        "id_type": 111,
        "is_special": false,
        "label": "李四",
        "nation": "",
        "native_place_address": "",
        "native_place_code": 0,
        "photos": [],
        "population_status": 0,
        "relation_create_time": 1694080825,
        "relation_name": "父子关系",
        "relation_type": 2,
        "relation_update_time": 1694080825,
        "residential_address": "",
        "residential_code": 0,
        "source": 1,
        "special_info": [],
        "update_time": 1694080825,
        "use_status": 0,
        "work_unit": ""
      },
      "id": "3f58f04f5221c6df2e176273c3602d9f",
      "_key": "111-342622199011091592",
      "token": "4da4d46631ea6ea5a0e25844742ee90c_111-342622199011091592",
      "label": "李四",
      "id_card": "342622199011091592",
      "type": 'image',
      "category": "person",
      "relation": "父子关系",
      "description": "父子关系",
      "count": 0,
      "jumpUrl": "./?c=person_case_info&m=index&idCard=342622199011091592&id_type=111",
      "jumpRecordUrl": "",
      "paper_type": 111,
      "paper_type_text": "身份证",
      "description_": "同户籍人关系",
      "img": "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F021aa08e-5594-11ec-88b0-0cc47a9c4b97.jpg&xywh=712,1198,66,94&cut_img",
      "level": 1,
      "tokenArr": [
        {
          "source_id": "e2c13ddaae7f77dcfdf5a68029cecf67",
          "token": "4da4d46631ea6ea5a0e25844742ee90c_111-342622199011091592"
        }
      ]
    },
    {
      "is_master": "1",
      "level": 0,
      "id": "e2c13ddaae7f77dcfdf5a68029cecf67",
      "_key": "111-342622200011091591",
      "category": "person",
      // "type": 0,
      "label": "他爹",
      "id_card": "342622200011091591",
      "image_url": "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F009f3bb4-54fb-11ec-88b0-0cc47a9c4b97.jpg&xywh=121,1798,73,100&cut_img",
      "paper_type": 111,
      "paper_type_text": "身份证",
      "jumpRecordUrl": "./?c=person_case_info&m=index&idCard=342622200011091591&id_type=111",
      "jumpUrl": "./?c=person_case_info&m=index&idCard=342622200011091591&id_type=111"
    },
  ]
  const edges = [
    {
      "id": "e2c13ddaae7f77dcfdf5a68029cecf67-f89ac730d88cb5c9c65ebc524878fe05",
      "source": "e2c13ddaae7f77dcfdf5a68029cecf67",
      "source_category": "person",
      "target": "f89ac730d88cb5c9c65ebc524878fe05",
      "target_category": "person",
      "description": "夫妻关系",
      "category": "person-person",
      "relation": "夫妻关系",
      "tokenArr": [
        {
          "source_id": "e2c13ddaae7f77dcfdf5a68029cecf67",
          "token": "4da4d46631ea6ea5a0e25844742ee90c_111-342622199011091591"
        }
      ]
    },
    {
      "id": "f89ac730d88cb5c9c65ebc524878fe05-c3a73dfc5b6cc5fd6b913cd3625c235a",
      "source": "f89ac730d88cb5c9c65ebc524878fe05",
      "source_category": "person",
      "target": "c3a73dfc5b6cc5fd6b913cd3625c235a",
      "target_category": "vehicle",
      "description": "---",
      "category": "person-goods",
      "relation": "车辆",
      "tokenArr": [
        {
          "source_id": "f89ac730d88cb5c9c65ebc524878fe05",
          "token": "4da4d46631ea6ea5a0e25844742ee90c_02-6bKBQTEyMzQ1"
        }
      ]
    },
    {
      "id": "e2c13ddaae7f77dcfdf5a68029cecf67-d29e32d4098f9460d84cf4c082c751b2",
      "source": "e2c13ddaae7f77dcfdf5a68029cecf67",
      "source_category": "person",
      "target": "d29e32d4098f9460d84cf4c082c751b2",
      "target_category": "person",
      "description": "父子关系",
      "category": "person-person",
      "relation": "父子关系",
      "tokenArr": [
        {
          "source_id": "e2c13ddaae7f77dcfdf5a68029cecf67",
          "token": "4da4d46631ea6ea5a0e25844742ee90c_111-371521198410264915"
        }
      ]
    },
    {
      "id": "e2c13ddaae7f77dcfdf5a68029cecf67-c2624c7659d3328cbad60306687c40b5",
      "source": "e2c13ddaae7f77dcfdf5a68029cecf67",
      "source_category": "person",
      "target": "c2624c7659d3328cbad60306687c40b5",
      "target_category": "person",
      "description": "祖父关系",
      "category": "person-person",
      "relation": "祖父关系",
      "tokenArr": [
        {
          "source_id": "e2c13ddaae7f77dcfdf5a68029cecf67",
          "token": "4da4d46631ea6ea5a0e25844742ee90c_111-342622199011091594"
        }
      ]
    },
    {
      "id": "e2c13ddaae7f77dcfdf5a68029cecf67-3f58f04f5221c6df2e176273c3602d9f",
      "source": "e2c13ddaae7f77dcfdf5a68029cecf67",
      "source_category": "person",
      "target": "3f58f04f5221c6df2e176273c3602d9f",
      "target_category": "person",
      "description": "父子关系",
      "category": "person-person",
      "relation": "父子关系",
      "tokenArr": [
        {
          "source_id": "e2c13ddaae7f77dcfdf5a68029cecf67",
          "token": "4da4d46631ea6ea5a0e25844742ee90c_111-342622199011091592"
        }
      ]
    }]
  let graph: any = null
  useEffect(() => {

    // 创建 G6 图实例
    graph = new G6.Graph({
      container: 'relation-chart', // 指定图画布的容器 id
      // 画布宽高
      width: 800,
      height: 500,
      defaultNode: {
        size: 20,
        labelCfg: {
          /* label's position, options: center, top, bottom, left, right */
          position: 'bottom',
          /* label's offset to the keyShape, 4 by default */
          offset: 12,
          /* label's style */
          style: {
            fontSize: 20,
            fill: '#ccc',
            fontWeight: 500
          }
        },
        clipCfg: {
          show: true,
          type: 'circle',
          r: 100
        },
        icon: {
          /* whether show the icon, false by default */
          show: true,
          /* icon's img address, string type */
          img: 'https://gw.alipayobjects.com/zos/basement_prod/012bcf4f-423b-4922-8c24-32a89f8c41ce.svg',
          /* icon's size, 20 * 20 by default: */
          //   width: 40,
          //   height: 40
        },
      },
      modes: {
        default: ['zoom-canvas', 'drag-canvas', 'drag-node'],
      },
      nodeStateStyles: {
        selected: {
          // stroke: 'red',
          lineWidth: 3,
        }
      },
      // comboStateStyles: {
      //   actived: {
      //     // stroke: 'red',
      //     lineWidth: 3,
      //   },
      //   selected: {
      //     stroke: 'blue',
      //     lineWidth: 3,
      //   }
      // },
    });

    graph.data({
      nodes: elements,
      edges: edges
    })
    graph.render(); // 渲染图
    graph.on('click', (ev: any) => {
      console.log(ev);
      // const model = {
      //   id: 'node',
      //   label: 'node',
      //   address: 'cq',
      //   x: 200,
      //   y: 150,
      //   style: {
      //     fill: 'blue',
      //   },
      // };

      // graph.addItem('node', model);
      // 通过 ID 查询节点实例
      // 等价于
      // graph.showItem('nodeId');
      graph.getNodes().forEach((node: any) => {
        graph.clearItemStates(node);
      });
      const item = ev.item;
      //  item.getModel() 获取该节点数据
      if (item) {
        const model = item.getModel() || {};
        const _item = graph.getNeighbors(model?.id || '', 'source');
        console.log(_item);
        // this.graph.getNodes().forEach(node => {
        //   let data = node.getModel()
        //   if (data.relationType === '3') {
        //     this.graph.showItem(node)
        //   }
        // })
        graph.setItemState(item, 'selected', true);
        console.log(model);

        graph.updateItem(item, {
          size: 30,
          label: model?.label || '' + model?.relation || '',
        });
        graph.layout();
      }
    });

    graph.on('node:dragstart', function (e: any) {
    });
    graph.on('node:drag', function (e: any) {
    });
    graph.on('node:dragend', function (e: any) {
    });
    graph.on('canvas:click', (evt: any) => {
      graph.getNodes().forEach((node: any) => {
        graph.clearItemStates(node);
      });
    });



  }, [])
  return <div style={{ height: '100%' }}>
    <div>
      <Button onClick={() => {
        graph.updateLayout({
          type: 'circular',
          ordering: 'degree',
        })

      }}>圆形</Button>
      <Button onClick={() => {
        graph.updateLayout({
          type: 'dagre',
        })
      }}>层次</Button>
      <Button onClick={() => {

        graph.updateLayout({
          type: 'grid',
          // begin: [50, 150],
          preventOverlap: true,
          // preventOverlapPdding: 80,
          nodeSize: 80,
          cols: 5
        })
      }}>矩形</Button>
      <Button onClick={() => {
        graph.updateLayout({
          type: 'comboCombined'
        })

      }}>网格</Button>
    </div>
    <div id="relation-chart" className="relation-chart"></div>
  </div>
}