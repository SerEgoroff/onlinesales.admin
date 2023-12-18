import { useEffect, useState } from "react";
import { OrderDetailsDto, OrderItemDetailsDto, OrderUpdateDto } from "lib/network/swagger-client";
import { useRequestContext } from "providers/request-provider";
import { OrderForm } from "../form";
import { useRouteParams } from "typesafe-routes";
import { editFormRoute } from "@lib/router";

export const OrderEdit = () => {
  const { client } = useRequestContext();

  const { id } = useRouteParams(editFormRoute);

  const [order, setOrder] = useState<OrderDetailsDto>();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await client.api.ordersDetail(id);
        setOrder(data);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [client]);

  const handleSave = async (newOrder: OrderDetailsDto) => {
    const updateDto: OrderUpdateDto = {
      ...newOrder!,
    };
    await client.api.ordersPartialUpdate(id, updateDto!);
  };

  return <OrderForm order={order} updateOrder={setOrder} handleSave={handleSave} isEdit={true} />;
};
