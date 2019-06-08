import $ from "jquery";
// const radom = () => Math.floor(Math.random() * 10);
// const radomVal = radom();
// console.log(radomVal, "radomVal");
// setTimeout(() => {
//   console.log("2");
// }, 2000);
// console.log("3");
///// bai 1
let products;
/// chay render
const renders = products => {
  // let cardinalNum = 1;
  $("tr")
    .not($("tr#title"))
    .remove();
  $("td").remove();
  products.forEach((e, index) => {
    const newRow = `<tr class="table-light">  
      <td> ${index + 1} </td> 
      <td> <img width= "50px" src="${e.img_url}" id ="${e.id}"> </td> 
      <td> ${e.name} </td> 
      <td>  ${e.price.toLocaleString()} </td> 
      <td> ${e.final_price.toLocaleString()} </td> 
      <td>  ${e.promotion_percent.toLocaleString()} </td> 
      <td><button data-id=${
        e.id
      } class="btn btn-danger btn-detail">Chi tiết</button></td>  
    </tr>
  `;

    $("table#simple").append(newRow);
  });
  $(".btn-detail").click(function(e) {
    const id = $(this).attr("data-id");
    showDetailProduct(id);
  });
};

/// sort function
const sortFunction = (desc, property, list) => {
  let resultList = list;
  if (desc) {
    resultList.sort((a, b) => a[property] - b[property]);
  } else {
    if (property === "text") {
      resultList.sort();
      resultList.reverse();
    } else {
      resultList.sort((a, b) => b[property] - a[property]);
    }
  }
  return resultList;
};

function filterFunction(target, list) {
  return list.filter(elm => elm.promotion_percent >= target);
}

/// lay request API
let dataGB;
function requestAPI(url, method, cb) {
  $.ajax({
    url,
    method
  })
    .done(result => {
      dataGB = result.data;
      renders(dataGB);
      cb(dataGB);
    })
    .catch(error => {
      console.log("error");
    });
}
// tạo dataGlobal ở ngoài function
// let dataGlobal;

// tạo hàm get các sản phẩm từ API của Sendo
const getProduct = category => {
  requestAPI(
    `https://mapi.sendo.vn/mob/product/cat/${category}/?p=1`,
    "GET",
    result => {
      console.log(result);
    }
  );
};

/// get  api
const searchProduct = item => {
  requestAPI(
    ` https://mapi.sendo.vn/mob/product/search?p=1&q=${item}`,
    "GET",
    result => {
      console.log(result);
    }
  );
};

/// show pgab deail ///
// get data
getProduct("usb");

/// button
$("button#sortNumDesc").click(() => {
  let result = sortFunction(true, "price", [...products]);
  renders(result);
});

$("button#sortNumAsc").click(() => {
  let result = sortFunction(false, "price", [...products]);
  renders(result);
});

$("button#sortTextDesc").click(() => {
  let result = sortFunction(true, "price", [...products]);
  renders(result);
});

$("button#sortTextAsc").click(() => {
  let result = sortFunction(true, "price", [...products]);
  renders(result);
});

$("button#findBigSale").click(() => {
  let result = filterFunction(10, [...products]);
  renders(result);
});
/// search
console.log($("form#search")[0], "form");
$("form#search")[0].onsubmit = elm => {
  console.log("ok");
  elm.preventDefault();
  const searchEvent = $("input#searchInput").val();
  if (!searchProduct(searchEvent) && searchProduct(searchEvent) !== undefined) {
    return searchProduct(searchEvent);
  } else {
    // $("tr").remove();
    $("p#notfound").show();
  }
};

function showDetailProduct(id) {
  $.ajax({
    url: ` https://mapi.sendo.vn/mob/product/${id}/detail/ `,
    method: "GET"
  })
    .done(function(result) {
      $("tr")
        .not("tr#titleBottom")
        .remove();
      // let count = 1;
      $("table#list").append(
        `<thead>
					 <tr id="title">
					 		<th>Mô tả sản phẩm</th>
						</tr>
					</thead>
					<tr>
						<td>${result.description}</td> 
					</tr>
				`
      );
      $("table#list2").append(
        `
					<tr>
						<th scope="row">SKU sản phẩm</th>
						<td>${result.sku}</td>
					</tr>
					<tr>
						<th scope="row">Giá</th>
						<td>${result.price}</td>
					</tr>
					<tr>
						<th scope="row">Giá khuyến mãi</th>
						<td>${result.final_price.toLocaleString()}</td>
					</tr>
					<tr>
						<th scope="row">% Khuyến mãi</th>
						<td>${result.promotion_percent.toLocaleString()}</td>
					</tr>					
					<tr>
						<th scope="row">Tình trạng</th>
						<td>${result.status_text}</td>
					</tr>
        `
      );
    })
    .catch(function(error) {
      console.log(error);
    });
}
