# This shouldn't load too much stuff, only stuff that will be displayed on the index page. Counts etc.
class WipSerializer < ActiveModel::Serializer
  attributes :id, :url
  attributes :product_slug,
             :product_name,
             :title,
             :number,
             :state,
             :winner,
             :promoted,
             :push_channel,
             :comments_count,
             :score,
             :score_multiplier,
             :deliverable

  # personalized
  attributes :own_comments

  has_one  :user, :key => :author, serializer: UserSerializer

  def product_slug
    product.slug
  end

  def product_name
    product.name
  end

  def url
    case wip.type
    when 'Discussion'
      product_discussion_path(product, wip)
    else
      product_wip_path(product, wip)
    end
  end

  def state
    wip.current_state.to_s
  end

  def promoted
    wip.promoted?
  end

  def winners
    if winners = wip.winners
      winners.each { |winner| UserSerializer.new(winner) }
    end
  end

  # personalized

  def own_comments
    wip.comments.where(user: scope).count if scope
  end

  # private

  def product
    @product ||= wip.product
  end

  def wip
    object
  end

end
