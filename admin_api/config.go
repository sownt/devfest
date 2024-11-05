package main

import (
	firebase "firebase.google.com/go"
	"gorm.io/gorm"
	"time"
)

const (
	UserSessionExpiresIn = time.Hour * 24
	// TODO: Migrate
	newAccountEmailBody = `<!doctype html>
<html>
  <body>
    <div
      style='background-color:#FFFFFF;color:#262626;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'
    >
      <table
        align="center"
        width="100%"
        style="margin:0 auto;max-width:600px;background-color:#FFFFFF;border-radius:0"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <tbody>
          <tr style="width:100%">
            <td>
              <div style="padding:0px 0px 24px 0px;text-align:center">
                <img
                  alt="GDG Cloud Hanoi"
                  src="https://devfest.gdgcloudhanoi.dev/_next/image?url=/email/header.png&amp;w=750&amp;q=75"
                  style="outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%"
                />
              </div>
              <div
                style="font-size:18px;font-weight:bold;padding:0px 24px 0px 24px"
              >
                Xin chào, {{if .Name}}{{.Name}}{{end}}
              </div>
              <div style="font-weight:normal;padding:0px 24px 0px 24px">
                <p>
                  Cảm ơn bạn đã đăng ký tham gia ngày hội công nghệ
                  <b>Google Cloud DevFest Hanoi 2024</b>. GDG Cloud Hanoi rất
                  trân trọng sự quan tâm của bạn dành cho sự kiện này.
                </p>
              </div>
              <div style="font-weight:normal;padding:0px 24px 0px 24px">
                <p>
                  Do giới hạn về số lượng người tham gia, BTC sẽ ưu tiên chọn
                  lựa những đơn đăng ký phù hợp nhất để đảm bảo sự kiện diễn ra
                  thành công và mang lại trải nghiệm tốt nhất cho tất cả mọi
                  người. Những tech-lovers phù hợp sẽ nhận được
                  <em
                    ><span style="color:red"
                      >email xác nhận đăng ký thành công</span
                    ></em
                  >
                  kèm theo vé tham dự và thông tin chi tiết về chương trình
                  trong thời gian tới.
                </p>
              </div>
              <div style="font-weight:normal;padding:0px 24px 16px 24px">
                <p>
                  Trong thời gian chờ đợi, nếu có bất kỳ thắc mắc nào, bạn vui
                  lòng liên hệ
                  <a
                    href="https://www.facebook.com/GDGCloudHanoi"
                    target="_blank"
                    >Facebook GDG Cloud Hanoi</a
                  >
                  để được tư vấn và hỗ trợ sớm nhất.
                </p>
              </div>
              <div style="font-weight:normal;padding:0px 24px 0px 24px">
                <p>Trân trọng,<br /><em>GDG Cloud Hanoi Team</em>.</p>
              </div>
              <div style="padding:24px 0px 24px 0px">
                <hr
                  style="width:100%;border:none;border-top:1px solid #CCCCCC;margin:0"
                />
              </div>
              <div style="padding:0px 64px 16px 64px;text-align:center">
                <img
                  alt="GDG"
                  src="https://devfest.gdgcloudhanoi.dev/_next/image?url=/email/footer.png&amp;w=750&amp;q=75"
                  style="outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>`
	newAccountEmailJson = `{
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#FFFFFF",
      "borderRadius": 0,
      "canvasColor": "#FFFFFF",
      "textColor": "#262626",
      "fontFamily": "MODERN_SANS",
      "childrenIds": [
        "block-1726669752579",
        "block-1726669783613",
        "block-1726669881530",
        "block-1728843405221",
        "block-1726680850612",
        "block-1726680878851",
        "block-1726680913150",
        "block-1726670233481"
      ]
    }
  },
  "block-1726669752579": {
    "type": "Image",
    "data": {
      "style": {
        "padding": {
          "top": 0,
          "bottom": 24,
          "right": 0,
          "left": 0
        },
        "textAlign": "center"
      },
      "props": {
        "url": "https://devfest.gdgcloudhanoi.dev/_next/image?url=/email/header.png&w=750&q=75",
        "alt": "GDG Cloud Hanoi",
        "linkHref": null,
        "contentAlignment": "middle"
      }
    }
  },
  "block-1726669783613": {
    "type": "Text",
    "data": {
      "style": {
        "fontSize": 18,
        "fontWeight": "bold",
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "Xin chào, {{if .Name}}{{.Name}}{{end}}"
      }
    }
  },
  "block-1726669881530": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "markdown": true,
        "text": "Cảm ơn bạn đã đăng ký tham gia ngày hội công nghệ <b>Google Cloud DevFest Hanoi 2024</b>. GDG Cloud Hanoi rất trân trọng sự quan tâm của bạn dành cho sự kiện này."
      }
    }
  },
  "block-1726670233481": {
    "type": "Image",
    "data": {
      "style": {
        "padding": {
          "top": 0,
          "bottom": 16,
          "right": 64,
          "left": 64
        },
        "textAlign": "center"
      },
      "props": {
        "url": "https://devfest.gdgcloudhanoi.dev/_next/image?url=/email/footer.png&w=750&q=75",
        "alt": "GDG",
        "linkHref": null,
        "contentAlignment": "middle"
      }
    }
  },
  "block-1726678988977": {
    "type": "Text",
    "data": {
      "style": {
        "fontSize": 14,
        "fontWeight": "normal",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "Mã Check-in"
      }
    }
  },
  "block-1726679021041": {
    "type": "Text",
    "data": {
      "style": {
        "fontSize": 24,
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "{{.SecretCode}}"
      }
    }
  },
  "block-1726679574258": {
    "type": "Html",
    "data": {
      "style": {
        "fontSize": 16,
        "textAlign": "center",
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 0,
          "left": 0
        }
      },
      "props": {
        "contents": "<svg width=\"56\" heigh=\"56\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"2\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z\" />\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z\" />\n</svg>"
      }
    }
  },
  "block-1726679611572": {
    "type": "Html",
    "data": {
      "style": {
        "fontSize": 16,
        "textAlign": "center",
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 0,
          "left": 0
        }
      },
      "props": {
        "contents": "<svg  width=\"56\" heigh=\"56\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"2\" stroke=\"currentColor\" class=\"size-6\">\n  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z\" />\n</svg>\n"
      }
    }
  },
  "block-1726679839299": {
    "type": "Text",
    "data": {
      "style": {
        "fontSize": 21,
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 8,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "Hotel du Parc Hanoi"
      }
    }
  },
  "block-1726679900565": {
    "type": "Text",
    "data": {
      "style": {
        "fontSize": 14,
        "fontWeight": "normal",
        "padding": {
          "top": 0,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "84 P. Trần Nhân Tông, Nguyễn Du, Hai Bà Trưng, Hà Nội"
      }
    }
  },
  "block-1726680080137": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 0
        }
      },
      "props": {
        "text": "Thời gian"
      }
    }
  },
  "block-1726680091963": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 0,
          "left": 24
        }
      },
      "props": {
        "text": "Chủ nhât, 30 tháng 11, 2024"
      }
    }
  },
  "block-1726680223728": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 24,
          "left": 0
        }
      },
      "props": {
        "text": "Thời gian"
      }
    }
  },
  "block-1726680269653": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 24,
          "left": 0
        }
      },
      "props": {
        "text": "Check-in"
      }
    }
  },
  "block-1726680283667": {
    "type": "Text",
    "data": {
      "style": {
        "fontSize": 21,
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "Chủ nhật, 30 tháng 11, 2024"
      }
    }
  },
  "block-1726680347230": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "13:30 ~ 17:50"
      }
    }
  },
  "block-1726680361499": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "Từ 13:00"
      }
    }
  },
  "block-1726680850612": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 0,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "markdown": true,
        "text": "Trong thời gian chờ đợi, nếu có bất kỳ thắc mắc nào, bạn vui lòng liên hệ [Facebook GDG Cloud Hanoi](https://www.facebook.com/GDGCloudHanoi) để được tư vấn và hỗ trợ sớm nhất."
      }
    }
  },
  "block-1726680878851": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "markdown": true,
        "text": "Trân trọng,\n_GDG Cloud Hanoi Team_."
      }
    }
  },
  "block-1726680913150": {
    "type": "Divider",
    "data": {
      "style": {
        "padding": {
          "top": 24,
          "bottom": 24,
          "right": 0,
          "left": 0
        }
      },
      "props": {
        "lineColor": "#CCCCCC"
      }
    }
  },
  "block-1728584962768": {
    "type": "Container",
    "data": {
      "style": {
        "backgroundColor": "#FFFFFF",
        "borderRadius": 24,
        "padding": {
          "top": 24,
          "bottom": 24,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "childrenIds": ["block-1728584972330"]
      }
    }
  },
  "block-1728584972330": {
    "type": "Image",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "url": "data:image/png;base64, {{.QrCode}}",
        "alt": "Check-in Code",
        "linkHref": null,
        "contentAlignment": "middle"
      }
    }
  },
  "block-1728843405221": {
    "type": "Text",
    "data": {
      "style": {
        "color": null,
        "fontWeight": "normal",
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "markdown": true,
        "text": "Do giới hạn về số lượng người tham gia, BTC sẽ ưu tiên chọn lựa những đơn đăng ký phù hợp nhất để đảm bảo sự kiện diễn ra thành công và mang lại trải nghiệm tốt nhất cho tất cả mọi người. Những tech-lovers phù hợp sẽ nhận được _<span style=\"color:red\">email xác nhận đăng ký thành công</span>_ kèm theo vé tham dự và thông tin chi tiết về chương trình trong thời gian tới."
      }
    }
  }
}
`
)

var (
	db          *gorm.DB
	firebaseApp *firebase.App
)