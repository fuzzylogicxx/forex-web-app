class RatesController < ApplicationController

    private
        def rate_params
            params.require(:rate).permit(:amount)
        end

end

