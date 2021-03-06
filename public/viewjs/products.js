﻿var productsTable = $('#products-table').DataTable({
	'order': [[1, 'asc']],
	'columnDefs': [
		{ 'orderable': false, 'targets': 0 },
		{ 'searchable': false, "targets": 0 }
	].concat($.fn.dataTable.defaults.columnDefs)
});
$('#products-table tbody').removeClass("d-none");
productsTable.columns.adjust().draw();

$("#search").on("keyup", Delay(function()
{
	var value = $(this).val();
	if (value === "all")
	{
		value = "";
	}

	productsTable.search(value).draw();
}, 200));

$("#product-group-filter").on("change", function()
{
	var value = $("#product-group-filter option:selected").text();
	if (value === __t("All"))
	{
		value = "";
	}

	productsTable.column(6).search(value).draw();
});

$("#clear-filter-button").on("click", function()
{
	$("#search").val("");
	$("#product-group-filter").val("all");
	productsTable.column(7).search("").draw();
	productsTable.search("").draw();
	$("#show-disabled-products").prop('checked', false);
});

if (typeof GetUriParam("product-group") !== "undefined")
{
	$("#product-group-filter").val(GetUriParam("product-group"));
	$("#product-group-filter").trigger("change");
}

$(document).on('click', '.product-delete-button', function(e)
{
	var objectName = $(e.currentTarget).attr('data-product-name');
	var objectId = $(e.currentTarget).attr('data-product-id');

	bootbox.confirm({
		message: __t('Are you sure to delete product "%s"?', objectName) + '<br><br>' + __t('This also removes any stock amount, the journal and all other references of this product - consider disabling it instead, if you want to keep that and just hide the product.'),
		closeButton: false,
		buttons: {
			confirm: {
				label: __t('Yes'),
				className: 'btn-success'
			},
			cancel: {
				label: __t('No'),
				className: 'btn-danger'
			}
		},
		callback: function(result)
		{
			if (result === true)
			{
				jsonData = {};
				jsonData.active = 0;
				Grocy.Api.Delete('objects/products/' + objectId, {},
					function(result)
					{
						window.location.href = U('/products');
					},
					function(xhr)
					{
						console.error(xhr);
					}
				);
			}
		}
	});
});

$("#show-disabled-products").change(function()
{
	if (this.checked)
	{
		window.location.href = U('/products?include_disabled');
	}
	else
	{
		window.location.href = U('/products');
	}
});

if (GetUriParam('include_disabled'))
{
	$("#show-disabled-products").prop('checked', true);
}
