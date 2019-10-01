class RatesController < ApplicationController

    require 'net/http'
    require 'json'

    def index
        uri = URI('http://data.fixer.io/api/latest?access_key=429ca83b5757bee8cbf4b997f620f3ab&base=EUR&symbols=USD,GBP,JPY,AUD,CAD,CHF,CNY,SEK,NZD')
        response = Net::HTTP.get(uri)
        @rates = JSON.parse(response)
    end


    private
        def rate_params
            params.require(:rate).permit(:amount)
        end

end

