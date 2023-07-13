// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from "react"
import styles from "./TableView.module.css"
import "./TableView.scss"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import BootstrapTable from "react-bootstrap-table-next"
import { useTranslation } from "react-i18next"

const TableView = ({
    type = "single_location",
    timeRange,
    selectedTimeEntity,
    data = [],
    labels = {},
    heading = ""
}) => {
    const { t } = useTranslation()

    const columns =
        type === "flow"
            ? [
                  {
                      dataField: "id",
                      text: t("dashboard.origin_code"),
                      sort: true,
                      onSort: (field, order) => {}
                  },
                  {
                      dataField: "name",
                      text: t("dashboard.origin_name"),
                      sort: true,
                      onSort: (field, order) => {}
                  },
                  {
                      dataField: "id2",
                      text: t("dashboard.dest_code"),
                      sort: true,
                      onSort: (field, order) => {}
                  },
                  {
                      dataField: "name2",
                      text: t("dashboard.dest_name"),
                      sort: true,
                      onSort: (field, order) => {}
                  },
                  {
                      dataField: "value",
                      text: t("dashboard.value"),
                      sort: true,
                      onSort: (field, order) => {}
                  }
              ]
            : [
                  {
                      dataField: "id",
                      text: t("dashboard.area_code"),
                      sort: true,
                      onSort: (field, order) => {}
                  },
                  {
                      dataField: "name",
                      text: t("dashboard.area_name"),
                      sort: true,
                      onSort: (field, order) => {}
                  },
                  {
                      dataField: "value",
                      text: t("dashboard.value"),
                      sort: true,
                      onSort: (field, order) => {}
                  }
              ]

    const processedData =
        type === "flow"
            ? Object.entries(data)
                  .map(origin => {
                      return Object.entries(origin[1]).map(dest => {
                          return {
                              id: origin[0],
                              name: labels[origin[0]],
                              id2: dest[0],
                              name2: labels[dest[0]],
                              value: Number(dest[1])
                          }
                      })
                  })
                  .flat()
            : Object.entries(data).map(row => {
                  return { id: row[0], name: labels[row[0]], value: Number(row[1]) }
              })

    return (
        <div className={`${styles.TableView} TableView`} data-testid="TableView">
            {timeRange && selectedTimeEntity !== undefined && data && (
                <>
                    <h2>{heading}</h2>

                    <BootstrapTable
                        hover
                        keyField="id"
                        columns={columns}
                        data={processedData}
                        defaultSorted={[
                            {
                                dataField: "id",
                                order: "asc"
                            }
                        ]}
                    />
                </>
            )}
        </div>
    )
}

export default TableView
