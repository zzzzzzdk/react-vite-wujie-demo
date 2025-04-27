import ajax from '@/utils/axios.config'

const api = {

  common: {
  },

  // 列表模板
  getCardData: function (data) {
    return ajax({
      method: "get",
      url: '/card/get_card_data',
      data
    })
  },
}

export default {
  ...api
}
