from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from openrouteservice import client
import requests

import os
#use in terminal :  uvicorn main:app --reload --port 8000
app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/route", response_class=HTMLResponse)
async def show_map(request: Request):
    with open(os.path.join("templates", "route.html"), "r") as f:
        template_content = f.read()
    return templates.TemplateResponse("route.html", {"request": request, "template_content": template_content})


@app.post("/find_route", response_class=JSONResponse)
async def find_route(request: Request):
    json_data = await request.json()
    coordinates = json_data.get('geojson')
    reversed_coordinates = [[lng, lat] for lat, lng in coordinates]
    print(reversed_coordinates)

    api_key = '5b3ce3597851110001cf6248af5aa7185732404599ff7695349f6726'
    ors_client = client.Client(key=api_key)

    matrix = ors_client.distance_matrix(
        locations=reversed_coordinates,
        profile='driving-hgv',  # Specify the transportation profile
        metrics=['duration'],  # Specify whether to calculate distance, duration, or both
    )
    # Print the distance matrix
    print(matrix)

    distance_matrix = matrix['durations']
    print(distance_matrix)


    npoints = len(reversed_coordinates)
    size_1 = (1 << npoints) + 5
    size_2 = npoints + 1
    dp = [[0] * size_2 for _ in range(size_1)]
    par = [[0] * size_2 for _ in range(size_1)]

    for i in range(size_1):
        for j in range(size_2):
            dp[i][j] = int(1e18)
            par[i][j] = -1

    dp[1][0] = 0
    par[1][0] = -1

    for mask in range(size_1):
        for last in range(npoints - 1):
            if dp[mask][last] == 1e18:
                continue
            for nxt in range(npoints - 1):
                if (mask >> nxt) & 1:
                    continue
                else:
                    dist = distance_matrix[last][nxt]
                    nmask = mask + (1 << nxt)
                    if dp[nmask][nxt] > dp[mask][last] + dist:
                        dp[nmask][nxt] = dp[mask][last] + dist
                        par[nmask][nxt] = last
    for last in range(npoints - 1):
        nxt = npoints - 1
        dist = distance_matrix[last][nxt]
        mask = (1 << (npoints-1)) - 1
        nmask = (1 << npoints) - 1
        if dp[nmask][nxt] > dp[mask][last] + dist:
            dp[nmask][nxt] = dp[mask][last] + dist
            par[nmask][nxt] = last

    done = (1 << npoints) - 1
    print(dp[(1 << npoints) - 1][npoints - 1])
    cur = (done, npoints - 1)

    route = []
    while cur[1] != -1:
        print(cur)
        route.append(cur[1])
        pre1 = par[cur[0]][cur[1]]
        pre0 = cur[0] - (1 << cur[1])
        cur = (pre0, pre1)
    route.reverse()
    print(route)
    route_coordinates = []
    for index, value in enumerate(route):
        route_coordinates.append(reversed_coordinates[value])

    response = ors_client.directions(
            coordinates= route_coordinates,
            profile='driving-hgv',
            format='geojson',
            preference='shortest'
    )
    # print(response)
    return response

