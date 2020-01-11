import $ from "jquery";
import "../lib/jquery-confirm";
import _ from "lodash";

export const Confirm = {
  alert: (args: { title: string, content: any }) => {
    $.alert({
      title: args.title,
      content: args.content,
      escapeKey: true,
      backgroundDismiss: true
    });
  },
  confirm: (args: { title: string, content: string, confirmTitle: string, btnClass: string }) => {
    return new Promise((resolve, reject) => {
      $.confirm({
        title: args.title,
        content: args.content,
        escapeKey: true,
        backgroundDismiss: true,
        buttons: {
          confirm: {
            text: args.confirmTitle,
            btnClass: args.btnClass,
            action: () => {
              resolve();
            }
          },
          cancel: {
            text: "Отмена",
            btnClass: "btn-default",
            action: () => {
              reject("cancel");
            }
          }
        }
      });
    });
  },
  confirmDanger: (args: { title: string, content: string, confirmTitle: string }) => {
    return Confirm.confirm(_.assign({ btnClass: "btn-danger" }, args));
  },
  promptString: (args: { title: string, label: string, confirmTitle: string }) => {
    return new Promise((resolve, reject) => {
      $.confirm({
        title: args.title,
        escapeKey: true,
        backgroundDismiss: true,
        content: `
          <form action="">
              <div class="form-group">
                  <label>${args.label}</label>
                  <input type="text" class="form-control" required />
              </div>
          </form>
        `,
        buttons: {
          formSubmit: {
            text: args.confirmTitle,
            btnClass: "btn-primary",
            action: function () {
              resolve(this.$content.find("input.form-control").val());
            }
          },
          cancel: {
            text: "Отмена",
            btnClass: "btn-default",
            action: () => {
              reject("cancel");
            }
          }
        },
        onContentReady: function() {
          let self = this;
          this.$content.find("input.form-control").focus();
          this.$content.find("form").on("submit", function(e: any) {
            e.preventDefault();
            self.$$formSubmit.trigger("click");
          })
        }
      })
    });
  },
  errorHandler: (error: any) => {
    if (error != "cancel") {
      console.log(error);
      Confirm.alert({
        title: "Ошибка",
        content: (error.response && error.response.data) || (error.message) || String(error)
      });
    }
  },
  openWindow: (url: string) => {
    let popupWindow = window.open(url);
    if (!popupWindow || popupWindow.closed || typeof popupWindow.closed == 'undefined') {
      Confirm.alert({
        title: "Ошибка",
        content: "Браузер заблокировал всплывающее окно - пожалуйста, для нормальной работы разрешите всплывающие окна."
      })
    }
  }
};
